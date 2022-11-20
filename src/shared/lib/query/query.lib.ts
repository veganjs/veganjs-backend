export function createFilterTerms(
  property: string,
  value: ReadonlyArray<string>,
) {
  if (!value || !value.length) return []
  return [
    {
      terms: {
        [property]: value,
      },
    },
  ]
}

export function createFilterTerm(property: string, value?: string | boolean) {
  if (value == null) return []
  return [
    {
      term: {
        [property]: value,
      },
    },
  ]
}

export function createFilterMatchPhrasePrefix(
  property: string,
  value?: string,
) {
  if (!value) return []
  return [
    {
      match_phrase_prefix: {
        [property]: value,
      },
    },
  ]
}

export function createFilterMatchPhrase(property: string, value?: string) {
  if (!value) return []
  return [
    {
      match: {
        [property]: {
          query: value,
          fuzziness: 'auto',
        },
      },
    },
  ]
}
