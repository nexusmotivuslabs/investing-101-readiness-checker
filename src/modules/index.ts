import { module1 } from "./module1-readiness";
import { module2 } from "./module2-accounts-tax";
import { module3 } from "./module3-fees-platforms";
import { module4 } from "./module4-risk-scams";
import type { ModuleDefinition } from "../lib/types";

export const modules: ModuleDefinition[] = [module1, module2, module3, module4];

export function getModuleById(id: string): ModuleDefinition | undefined {
  return modules.find((m) => m.id === id);
}

export { module1, module2, module3, module4 };
