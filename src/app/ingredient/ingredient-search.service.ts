import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'

import { IngredientEntity } from './entities/ingredient.entity'

interface IngredientSearchBody {
  id: string
  name: string
}

@Injectable()
export default class IngredientSearchService {
  index = 'ingredients'

  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async searchIngredients(text: string) {
    const response =
      await this.elasticSearchService.search<IngredientSearchBody>({
        index: this.index,
        body: {
          query: {
            bool: {
              should: [
                {
                  match: {
                    name: {
                      query: text,
                      operator: 'and',
                      fuzziness: 'auto',
                    },
                  },
                },
                {
                  wildcard: {
                    name: {
                      value: '*' + text + '*',
                      boost: 1.0,
                      rewrite: 'constant_score',
                    },
                  },
                },
              ],
            },
          },
        },
      })
    const searchHits = response.hits.hits
    return searchHits.map((item) => item._source)
  }

  async indexIngredient(ingredient: IngredientEntity) {
    return this.elasticSearchService.index<IngredientSearchBody>({
      index: this.index,
      body: {
        id: ingredient.id,
        name: ingredient.name,
      },
    })
  }

  async updateIndex(ingredient: IngredientEntity) {
    const newBody = {
      id: ingredient.id,
      name: ingredient.name,
    }

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`
    }, '')

    return this.elasticSearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: ingredient.id,
          },
        },
        script: {
          source: script,
        },
      },
    })
  }

  async removeIndex(id: string) {
    this.elasticSearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id,
          },
        },
      },
    })
  }
}
