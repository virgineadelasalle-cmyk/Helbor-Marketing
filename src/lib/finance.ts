/** Valores monetários são armazenados como centavos inteiros. */
export type Allocation = { speCode: string; cents: number };
export type Posting = { id: string; competence: string; amountCents: number; state: "forecast" | "committed" | "realized" | "reversed"; allocations: Allocation[] };
export type Budget = { competence: string; approvedCents: number };
function integerCents(n: number): boolean { return Number.isSafeInteger(n) && n >= 0; }
export function validateAllocation(amountCents: number, allocations: Allocation[]): void {
  if (!integerCents(amountCents) || amountCents <= 0) throw new Error("Valor total inválido");
  if (!allocations.length) throw new Error("Informe ao menos uma SPE");
  const codes = new Set<string>();
  for (const row of allocations) {
    if (!row.speCode.trim() || codes.has(row.speCode.trim())) throw new Error("SPE ausente ou repetida");
    if (!integerCents(row.cents)) throw new Error("Valor de rateio inválido");
    codes.add(row.speCode.trim());
  }
  if (allocations.reduce((sum, row) => sum + row.cents, 0) !== amountCents) throw new Error("Rateio deve fechar o valor total");
}
export function allocatePercentages(amountCents: number, entries: { speCode: string; basisPoints: number }[]): Allocation[] {
  if (!integerCents(amountCents) || amountCents <= 0) throw new Error("Valor total inválido");
  if (!entries.length || entries.some(x => !Number.isSafeInteger(x.basisPoints) || x.basisPoints < 0) || entries.reduce((n,x) => n+x.basisPoints,0) !== 10000) throw new Error("Percentuais devem somar 100%");
  const rows = entries.map((x,i) => ({ speCode:x.speCode, cents:Math.floor(amountCents*x.basisPoints/10000), remainder:(amountCents*x.basisPoints)%10000, i }));
  let missing=amountCents-rows.reduce((n,x)=>n+x.cents,0);
  for (const row of [...rows].sort((a,b)=>b.remainder-a.remainder||a.i-b.i)) { if (!missing) break; row.cents++; missing--; }
  const result=rows.map(({speCode,cents})=>({speCode,cents}));
  validateAllocation(amountCents,result);
  return result;
}
export function budgetSummary(budget: Budget, postings: Posting[]) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(budget.competence) || !integerCents(budget.approvedCents)) throw new Error("Orçamento inválido");
  const matching=postings.filter(x=>x.competence===budget.competence);
  for (const p of matching) validateAllocation(p.amountCents,p.allocations);
  const sum=(state: Posting["state"])=>matching.filter(p=>p.state===state).reduce((n,p)=>n+p.amountCents,0);
  const forecastCents=sum("forecast"),committedCents=sum("committed"),realizedCents=sum("realized");
  return { approvedCents:budget.approvedCents,forecastCents,committedCents,realizedCents,accountingBalanceCents:budget.approvedCents-realizedCents,availableCents:budget.approvedCents-realizedCents-committedCents,utilizationPercent:budget.approvedCents?100*(realizedCents+committedCents)/budget.approvedCents:0 };
}
