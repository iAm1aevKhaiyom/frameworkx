import { App } from "../app/App"
import { CategoryInput } from "../input"
import { Category } from "../model"
import { CategoryRepository } from "../repository"

/**
 * Resolver for category declarations.
 */
export const CategoryDeclarationResolver = App.resolver({
  async category(args: { id: number }) {
    const category = await CategoryRepository.findOne(args.id)
    return category ? category : null
  },

  async categorySave(args: CategoryInput): Promise<Category> {
    return await CategoryRepository.save({
      id: args.id || undefined,
      name: args.name,
    })
  },

  async categoryRemove(args: { id: number }): Promise<boolean> {
    const category = await CategoryRepository.findOneOrFail(args.id)
    await CategoryRepository.remove(category)
    return true
  },
})
