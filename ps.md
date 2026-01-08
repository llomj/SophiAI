
# SophiAI Project Mandate

## 🚨 URGENT: DATA INTEGRITY & SOURCE PROTOCOL
**MANDATORY CHECK**: You MUST always read and verify this file and `matrix_models.md` before changing the code source in any way. 

### THE MATRIX RESTRAINT
The list of reasoning matrices (philosophical personas) is the core DNA of SophiAI. This list MUST remain consistent.
- **NEVER** remove or reset the `Persona` enum in `types.ts`.
- **NEVER** remove or reset the `PERSONA_CONFIGS` in `constants.tsx`.
- **SYNCHRONIZATION**: Any addition to the app's matrices must be mirrored in `matrix_models.md`.
- **STABILIZATION**: The full library of 100+ models from `matrix_models.md` has been synced into the active codebase.

### THE LAYOUT RESTRAINT
- **NEVER** change the layout structure, grid definitions, sidebar width, or core component positioning unless specifically requested.
- **CONSISTENCY**: Ensure all new features fit within the established cyber-philosophy aesthetic without disrupting the existing navigation flow.

## PERSISTENT FORGE REPOSITORIES
1. **Persona Forge (`/persona_forge/`)**: Contains hardcoded philosophical DNA (e.g., TJump axioms).
2. **Identity Forge (`/user_identity_forge/`)**: Stores the permanent `USER_PROMPT` behavioral directives.
3. **Log Forge (`/user_log_forge/`)**: Houses permanent historical context and `USER_LOG` summaries.
4. **Model Registry (`matrix_models.md`)**: The central index of all reasoning matrices.

## PENDING TASKS & SYNC LOGS
- **COMPLETED [2024-05-24]**: Integrated 26 new models across Scientific, Political, Economic, Biological, and Modern categories.
- **COMPLETED [2024-05-24]**: Relocated Capitalism, Anarchism, and Libertarianism to the Economic category per user request.
- **SYNC RULE**: The contents of `TJump_mind.ts` and `tjump.ts` must be concatenated during the `loadSophiData` process. This is currently handled in `utils/storage.ts`.

## RE-INSTALLATION PROCEDURE
Whenever `utils/storage.ts` is modified, ensure the following imports are maintained:
- `import { TJUMP_DATA } from '../persona_forge/tjump';`
- `import { TJUMP_MIND_DATA } from '../persona_forge/TJump_mind';`
- `import { USER_IDENTITY_DATA } from '../user_identity_forge/identity';`
- `import { USER_LOG_DATA } from '../user_log_forge/logs';`

## DIRECTORY STRUCTURE
- `persona_forge/`: AI personality knowledge (TJump, etc).
- `user_identity_forge/`: Static user persona definitions.
- `user_log_forge/`: Persistent memory/historical logs.
- `matrix_models.md`: The definitive list of philosophical matrices.
- `services/`: API communication layers.
- `utils/`: State management and storage logic.
- `components/`: UI modules.
