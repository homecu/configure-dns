#!/usr/bin/env npx ts-node

import { 
  saveApplyParameters as saveApply, 
  getLastApplyParameters 
} from "../utils/parameterMemory";

// Handle command line arguments
const command = process.argv[2];
const param = process.argv[3];

switch (command) {
  case 'save-apply':
    if (param) {
      saveApply(param);
    }
    break;
  case 'get-apply':
    const lastParams = getLastApplyParameters();
    console.log(lastParams.configPath || '');
    break;
  default:
    console.error('Usage: param-helper.ts [save-apply <path>|get-apply]');
    process.exit(1);
}