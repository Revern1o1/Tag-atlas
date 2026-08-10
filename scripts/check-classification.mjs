import fs from 'node:fs';
import path from 'node:path';

const file = process.env.REVIEW_FILE ?? path.join(process.cwd(), 'data', 'classification-review.json');
if (!fs.existsSync(file)) {
  console.error(`Missing classification review: ${file}`);
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(file, 'utf8'));
const minCoverage = Number(process.env.MIN_COVERAGE ?? '0.80');
if (report.totalRecords <= 0) process.exit(1);
if (report.coverage < minCoverage) {
  console.error(`Classification coverage ${report.coverage.toFixed(3)} is below required ${minCoverage.toFixed(3)}`);
  process.exit(2);
}
console.log(`Classification coverage ${report.coverage.toFixed(3)} passes minimum ${minCoverage.toFixed(3)}`);
