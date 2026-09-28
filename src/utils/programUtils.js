export function normalizeProgram(program) {
  if (!program) return null

  return {
    pblancId: program.pblancId,
    title: program.title,
    category: program.category,
    organization: program.organization,
    target: program.targetDescription,
    summary: program.description,
    applicationStartAt: program.applyStartDate,
    applicationEndAt: program.applyEndDate,
    rawApplyPeriod: program.rawApplyPeriod,
    apiUpdatedAt: program.apiUpdatedAt,
  }
}

export function normalizeProgramPage(responseData) {
  const content = Array.isArray(responseData)
    ? responseData
    : responseData?.content ?? []

  return content.map(normalizeProgram).filter(Boolean)
}
