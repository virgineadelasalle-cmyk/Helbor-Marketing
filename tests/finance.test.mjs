import assert from 'node:assert/strict';
import { test } from 'node:test';
import { allocatePercentages,budgetSummary,validateAllocation } from '../src/lib/finance.ts';
test('distributes remaining cents deterministically',()=>{assert.deepEqual(allocatePercentages(100,[{speCode:'A',basisPoints:3334},{speCode:'B',basisPoints:3333},{speCode:'C',basisPoints:3333}]),[{speCode:'A',cents:34},{speCode:'B',cents:33},{speCode:'C',cents:33}]);});
test('rejects inconsistent allocations',()=>{assert.throws(()=>validateAllocation(100,[{speCode:'A',cents:99}]));});
test('committed expense becomes realized without double counting',()=>{const p={id:'1',competence:'2026-04',amountCents:3000,allocations:[{speCode:'224',cents:3000}]};const b={competence:'2026-04',approvedCents:10000};assert.equal(budgetSummary(b,[{...p,state:'committed'}]).availableCents,7000);assert.equal(budgetSummary(b,[{...p,state:'realized'}]).availableCents,7000);});
