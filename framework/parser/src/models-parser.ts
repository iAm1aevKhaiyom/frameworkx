import {MetadataUtils, TypeMetadata} from "@microframework/core";
import * as ts from "typescript";
import {Errors} from "./errors";
import {ParserOptions} from "./options";
import {ParserUtils} from "./utils";

export class ModelParser {

    private program: ts.Program
    private options: ParserOptions
    private typeChecker: ts.TypeChecker

    constructor(program: ts.Program, options: ParserOptions) {
        this.program = program
        this.options = options
        this.typeChecker = program.getTypeChecker()
    }

    /**
     * If "goDeep" is set to true, parse doesn't go down deeper for object properties.
     */
    parse(node: ts.Node, parentName: string = "", goDeep: boolean = false): TypeMetadata {

        if (node.kind === ts.SyntaxKind.NumberKeyword) {
            return MetadataUtils.createType("number")

        } else if (node.kind === ts.SyntaxKind.StringKeyword) {
            return MetadataUtils.createType("string")

        } else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
            return MetadataUtils.createType("boolean")

        } else if (ts.isTypeAliasDeclaration(node)) {
            return this.parse(node.type, parentName)

        } else if (ts.isPropertySignature(node) && node.type) {
            return this.parse(node.type, parentName)

        } else if (ts.isArrayTypeNode(node)) {
            const type = this.parse(node.elementType, parentName)
            type.array = true
            return type

        } else if (ts.isTypeLiteralNode(node)) {
            return MetadataUtils.createType("object", {
                properties: this.parseMembers(node.members, parentName),
            })

        } else if (ts.isEnumDeclaration(node)) {
            return MetadataUtils.createType("enum", {
                properties: this.parseMembers(node.members, parentName),
            })

        } else if (ts.isIntersectionTypeNode(node)) {
            const properties: TypeMetadata[] = []
            node.types.forEach(type => {
                const parsed = this.parse(type, ParserUtils.joinStrings(parentName), true)
                properties.push(...parsed.properties)
            })

            return MetadataUtils.createType("object", {
                properties,
            })

        } else if (ts.isClassDeclaration(node)) {
            if (!node.name)
                throw Errors.modelClassNoName(parentName)

            const typeName = node.name.text
            const properties = (!parentName || goDeep) ? this.parseMembers(node.members, typeName) : []

            return MetadataUtils.createType("object", {
                typeName,
                properties,
            })

        } else if (ts.isInterfaceDeclaration(node)) {
            if (!node.name)
                throw Errors.modelInterfaceNoName(parentName)

            const typeName = node.name.text
            const properties = (!parentName || goDeep) ? this.parseMembers(node.members, typeName) : []
            return MetadataUtils.createType("object", { typeName, properties })

        } else if (ts.isUnionTypeNode(node)) {

            // extract information about nullability and undefined-ability
            const nullType = node.types.find(type => type.kind === ts.SyntaxKind.NullKeyword)
            const undefinedType = node.types.find(type => type.kind === ts.SyntaxKind.UndefinedKeyword)
            const typesWithoutNullAndUndefined = node.types.filter(type => type !== nullType && type !== undefinedType)
            const nullable = nullType !== undefined

            // this can only mean specified type was just "null", "undefined" or both
            if (typesWithoutNullAndUndefined.length === 0) {
                throw Errors.unionTypeDoesNotContainTypes(parentName)
            }

            // this means union type isn't real union type - its just a specific type that is also "undefined" and / or "null"
            // examples: "user: User | null", "photo: Photo | undefined", "counter: number | null | undefined"
            if (typesWithoutNullAndUndefined.length === 1) {
                const metadata = this.parse(typesWithoutNullAndUndefined[0], parentName)
                metadata.nullable = nullable
                return metadata
            }

            // if union consist of numbers - we just map it to the regular "number" kind
            const allAllNumberLiterals = typesWithoutNullAndUndefined.every(type => {
                return ts.isLiteralTypeNode(type) && ts.isNumericLiteral(type.literal)
            })
            if (allAllNumberLiterals) {
                return MetadataUtils.createType("number", { nullable })
            }

            // if union consist of booleans - we just map it to the regular "boolean" kind
            const allAllBooleanLiterals = typesWithoutNullAndUndefined.every(type => {
                return ts.isLiteralTypeNode(type) && (
                    type.literal.kind === ts.SyntaxKind.TrueKeyword ||
                    type.literal.kind === ts.SyntaxKind.FalseKeyword
                )
            })
            if (allAllBooleanLiterals) {
                return MetadataUtils.createType("boolean", { nullable })
            }

            // if union consist of strings - we create enumeration (maaaagic)
            const allAllStringLiterals = typesWithoutNullAndUndefined.every(type => {
                return ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal)
            })
            if (allAllStringLiterals) {

                // extract all literal strings and make sure they are valid for enum values
                const literals = typesWithoutNullAndUndefined.map(type => {

                    // this is not possible case, since there is a check above ^
                    if (!ts.isLiteralTypeNode(type) || !ts.isStringLiteral(type.literal))
                        return ""

                    // make sure name matches enum name requirements
                    if (!MetadataUtils.isNameValid(type.literal.text))
                        throw Errors.invalidStringLiteralValueForEnumName(parentName, type.literal.text)

                    return type.literal.text
                })

                // since we are generating a new enum, we rely on naming strategy to generate its name
                const typeName = this.options.namingStrategy?.enumNameFromStringLiteralUnion(parentName)
                if (!typeName)
                    throw Errors.emptyGeneratedEnumNameFromStringLiterals(parentName, literals)

                // create enum properties
                const properties = literals.map(literal => {
                    return MetadataUtils.createType("property", { propertyName: literal })
                })

                return MetadataUtils.createType("enum", {
                    typeName,
                    nullable,
                    properties
                })
            }

            const typeName = this.options.namingStrategy?.unionNameFromStringLiteralUnion(parentName)
            if (!typeName)
                throw Errors.emptyGeneratedUnionName(parentName)

            // make sure every type in the union is reference to some other type
            const allAllTypeReferences = typesWithoutNullAndUndefined.every(type => {
                return ts.isTypeReferenceNode(type)
            })
            if (!allAllTypeReferences)
                throw Errors.unionTypeFormatNotSupported(parentName)

            // finally create a union type for type references
            const properties = typesWithoutNullAndUndefined.map(type => this.parse(type, parentName))
            return MetadataUtils.createType("union", { typeName, nullable, properties })

        } else if (ts.isTypeReferenceNode(node)) {
            const referencedType = this.typeChecker.getTypeAtLocation(node)
            if (!ts.isIdentifier(node.typeName) || !node.typeName.text)
                throw Errors.typeReferenceInvalidName(parentName)

            // this is a special handling section for Model definitions
            if (referencedType.aliasSymbol && referencedType.aliasSymbol.name === "Model" && referencedType.aliasTypeArguments) {

                // extract model's type and args information
                const modelName = node.typeName.text
                const modelSymbol = referencedType.aliasTypeArguments[0].aliasSymbol || referencedType.aliasTypeArguments[0].symbol
                const modelType = modelSymbol ? modelSymbol.declarations[0] : undefined
                const argsSymbol = referencedType.aliasTypeArguments[1].aliasSymbol || referencedType.aliasTypeArguments[1].symbol
                const argsType = argsSymbol ? argsSymbol.declarations[0] : undefined
                if (!modelType)
                    throw Errors.invalidModelSignature(modelName, parentName)

                // if this is a nested call (in case we'll have a parent name) -
                // we don't go deeper to prevent recursion for named symbols
                if (parentName && !goDeep) {
                    return MetadataUtils.createType("model", {
                        modelName,
                    })
                }

                // create a model with a type
                const model = this.parse(modelType, ParserUtils.joinStrings(parentName/*, typeName*/))
                model.description = ts.displayPartsToString(modelSymbol.getDocumentationComment(this.typeChecker))
                model.modelName = modelName

                // create args if model with args
                if (argsType) {
                    const argsModel = this.parse(argsType, ParserUtils.joinStrings(parentName, /*typeName, */"Args"))

                    argsModel.properties.forEach(property => {
                        const modelProperty = model.properties.find(modelProperty => modelProperty.propertyName === property.propertyName)
                        if (!modelProperty)
                            throw new Error(`No property "${property.propertyName}" was found in the "${model.typeName}" model.`)

                        // todo: not sure about kind here
                        modelProperty.args = MetadataUtils.createType(argsModel.kind, {
                            typeName: argsModel.typeName,
                            propertyName: argsModel.propertyName,
                            properties: property.properties,
                        })
                    })
                }

                return model
            }

            // extract information out of type reference
            const typeName = node.typeName.text
            const symbol = referencedType.aliasSymbol || referencedType.symbol

            let resolvedType = undefined
            let description: string | undefined = undefined
            if (symbol) {
                resolvedType = symbol.declarations[0]
                description = ts.displayPartsToString(symbol.getDocumentationComment(this.typeChecker))
            }

            // if this is a nested call (this case we'll have a parent name) -
            // we don't go deeper to prevent recursion for named symbols
            if (parentName && !goDeep && (!resolvedType || !ts.isEnumDeclaration(resolvedType))) {
                return MetadataUtils.createType("object", {
                    typeName,
                    description,
                })
            }

            if (!resolvedType)
                throw Errors.cannotResolveTypeReference(typeName, parentName)

            return {
                ...this.parse(resolvedType, ParserUtils.joinStrings(parentName, typeName)),
                typeName,
                description,
            }

        } else if (ts.isImportTypeNode(node)) {

            // const referencedType = this.typeChecker.getTypeAtLocation(node)
            if (!node.qualifier || !ts.isIdentifier(node.qualifier))
                throw new Error(`Name is invalid`)
            if (node.qualifier.text !== "Model")
                throw new Error(`Not a Model`)
            if (!node.typeArguments || !node.typeArguments.length)
                throw new Error(`Invalid number of arguments`)

            const model = this.parse(node.typeArguments[0], parentName)
            if (node.typeArguments[1]) {
                // console.log(model);
                const referencedType = this.typeChecker.getTypeAtLocation(node.typeArguments[1])
                if (referencedType && referencedType.aliasSymbol) {
                    const declaration = referencedType.aliasSymbol!.declarations[0]
                    const argsModel = this.parse(declaration, ParserUtils.joinStrings(parentName, /*typeName, */"Args"))

                    argsModel.properties.forEach(property => {
                        const modelProperty = model.properties.find(modelProperty => modelProperty.propertyName === property.propertyName)
                        if (!modelProperty)
                            throw new Error(`No property "${property.propertyName}" was found in the "${model.typeName}" model.`)

                        // todo: not sure about kind here
                        modelProperty.args = MetadataUtils.createType(argsModel.kind, {
                            typeName: argsModel.typeName,
                            propertyName: argsModel.propertyName,
                            properties: property.properties,
                        })
                    })
                }
            }
            return model
        }

        throw Errors.signatureNotSupported(node)
    }

    private parseMembers(members: ts.NodeArray<ts.Node>, parentName: string): TypeMetadata[] {
        const properties: TypeMetadata[] = []
        for (let member of members) {
            
            // skip what we don't support
            if (!ts.isPropertySignature(member) &&
                !ts.isPropertyDeclaration(member) &&
                !ts.isEnumMember(member))
                continue
            if (!member.name)
                continue

            // get property description
            let description = undefined
            if ((member as any).symbol) { // todo: need to find a way to properly check if member has a documentation
                const memberSymbol: ts.Symbol = (member as any).symbol
                description = ts.displayPartsToString(memberSymbol.getDocumentationComment(this.typeChecker))
            }

            // get property name
            let propertyName = ParserUtils.normalizeTextSymbol(member.name.getText())

            if (ts.isPropertySignature(member) || ts.isPropertyDeclaration(member)) {
                if (member.type) {
                    const result = {
                        ...this.parse(member.type, ParserUtils.joinStrings(parentName, propertyName)),
                        propertyName: propertyName,
                        // description: description,
                    }
                    if (description) {
                        result.description = description
                    }
                    properties.push(result)
                }
            } else if (ts.isEnumMember(member)) {
                let value: any = undefined
                if (!member.initializer) {
                    throw Errors.enumPropertyInvalid(parentName, propertyName)
                }

                value = ParserUtils.normalizeTextSymbol(member.initializer.getText().trim())
                if (propertyName !== value) {
                    throw Errors.enumPropertyMustMatchValue(parentName, propertyName)
                }

                properties.push(MetadataUtils.createType("object", {
                    propertyName: propertyName,
                    description: description,
                }))
            }
        }
        return properties
    }


}