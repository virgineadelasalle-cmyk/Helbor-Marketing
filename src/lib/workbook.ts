import ExcelJS from 'exceljs';
export type ImportedShare={projectId:string;name:string;spe:string;cents:number};
export type ImportedRequest={id:string;title:string;type:string;status:string;date:string;requester:string;spe:string;estimated:number;realized:number;note:string;shares:ImportedShare[];details:Record<string,string>};
export type WorkbookData={name:string;budgetRows:{year:number;month:string;spe:string;product:string;cents:number;sourceRow:number}[];budgets:number[];expenses:number[];categories:number[][];products:{name:string;values:number[]}[];requests:ImportedRequest[];budgetCount:number;pending:number;rawExpenseCents:number;projects:{id:string;name:string;spe:string}[]};
const months=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const code=(v:unknown)=>v==null||v==='-'?'':String(v).trim();
export async function readWorkbook(buffer:ArrayBuffer,name:string):Promise<WorkbookData>{
 const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(buffer);
 for(const n of ['Verbas','Eventos','Passagens. Hotel','Reembolso'])if(!workbook.getWorksheet(n))throw new Error(`Aba ausente: ${n}`);
 const data:WorkbookData={name,budgetRows:[],budgets:Array(12).fill(0),expenses:Array(12).fill(0),categories:Array.from({length:3},()=>Array(12).fill(0)),products:[],requests:[],budgetCount:0,pending:0,rawExpenseCents:0,projects:[]};
 const names=new Map<string,string>();const productTotals=new Map<string,number[]>();
 const literal=(row:ExcelJS.Row,c:number):unknown=>{const v=row.getCell(c).value;if(v&&typeof v==='object'&&'formula'in v)return null;return v;};
 const cents=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)?Math.round(v*100):0;
 workbook.getWorksheet('Verbas')!.eachRow((row,i)=>{if(i<2)return;const month=months.indexOf(code(literal(row,2))),spe=code(literal(row,3)),product=code(literal(row,4));if(month<0||!spe)return;data.budgetCount++;data.budgetRows.push({year:Number(literal(row,1)),month:months[month],spe,product,cents:cents(literal(row,5)),sourceRow:i});if(Number(literal(row,1))===2026)data.budgets[month]+=cents(literal(row,5));if(!names.has(spe))names.set(spe,product||`SPE ${spe}`);});
 data.projects=[...names].map(([spe,name])=>({id:`spe:${spe}`,name,spe}));
 const specs=[{name:'Eventos',pairs:[10,12,14,16,18,20,22,24],category:0,type:'Evento',person:6,note:27},{name:'Passagens. Hotel',pairs:[9],category:1,type:'Passagem aérea',person:6,note:12},{name:'Reembolso',pairs:[6,8,10,12,14,16,18],category:2,type:'Reembolso',person:20,note:23}];
 for(const spec of specs){workbook.getWorksheet(spec.name)!.eachRow((row,i)=>{if(i<2||(!literal(row,1)&&!literal(row,3)))return;const rawDate=literal(row,1),month=months.indexOf(code(literal(row,2))),validDate=rawDate instanceof Date&&!Number.isNaN(rawDate.getTime());const shares:ImportedShare[]=[];for(const col of spec.pairs){const spe=code(literal(row,col)),value=cents(literal(row,col+1));if(!spe&&!value)continue;shares.push({projectId:`spe:${spe||'pendente'}`,name:names.get(spe)||`SPE ${spe||'não informada'}`,spe,cents:value});}
 const total=shares.reduce((n,x)=>n+x.cents,0);data.rawExpenseCents+=total;const issues:string[]=[];
 if(!validDate)issues.push('Data inválida');else if(rawDate.getFullYear()!==2026)issues.push('Histórico fora de 2026');else if(rawDate.getMonth()!==month)issues.push('Competência divergente da data');if(month<0)issues.push('Competência ausente');if(total<=0)issues.push('Custo zerado');if(shares.some(x=>!names.has(x.spe)))issues.push('SPE sem cadastro');
 const eligible=issues.length===0;if(!eligible)data.pending++;else{data.expenses[month]+=total;data.categories[spec.category][month]+=total;for(const s of shares){if(!productTotals.has(s.spe))productTotals.set(s.spe,Array(12).fill(0));productTotals.get(s.spe)![month]+=s.cents;}}
 const category=spec.category===1&&code(literal(row,7)).toLowerCase().includes('hosped')?'Hospedagem':spec.type;
 data.requests.push({id:`XLS-${spec.category}-${i}`,title:code(literal(row,3))||'Sem descrição',type:category,status:eligible?'Importada':'Importada — revisar',date:validDate?`${rawDate.getFullYear()}-${String(rawDate.getMonth()+1).padStart(2,'0')}-${String(rawDate.getDate()).padStart(2,'0')}`:'',requester:code(literal(row,spec.person))||'Não informado',spe:shares.map(x=>x.spe).join(', '),estimated:0,realized:total/100,note:code(literal(row,spec.note)),shares,details:{origem:`${spec.name}, linha ${i}`,mes:code(literal(row,2)),dataOriginal:validDate?rawDate.toISOString():code(rawDate),pendencias:issues.join('; ')}});
 });}
 data.products=[...productTotals].map(([spe,values])=>({name:names.get(spe)||spe,values}));return data;
}
