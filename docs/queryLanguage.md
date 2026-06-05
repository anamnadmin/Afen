# Afen Query Language (AQL)

AQL is Afen's domain-specific query interface for interacting with the causal graph and reasoning engine.

---

## Commands

### `TRACE`
Follows the causal chain from a given error node to its root cause.

**Syntax:**
```aql
TRACE  [MAX_DEPTH ]
```

**Example:**
```aql
TRACE err_42 MAX_DEPTH 5
```

**Output:**
Chain: err_42 → service_timeout → db_pool_exhausted
Root cause: db_pool_exhausted

---

### `CAUSE`
Lists all direct causes of a given error with associated confidence scores.

**Syntax:**
```aql
CAUSE <error_id>
```

**Example:**
```aql
CAUSE err_42
```

**Output:**
Direct causes of err_42:

service_timeout            (0.95)
memory_allocation_failure  (0.20)


---

### `EXPLAIN`
Generates a human-readable explanation of an error with root cause analysis and recommendations.

**Syntax:**
```aql
EXPLAIN <error_id> [FORMAT text|json]
```

**Example (text):**
```aql
EXPLAIN err_42 FORMAT text
```

**Output:**
Error "err_42" occurred because:

Database connection pool was exhausted (confidence: 95%).
Service timeout triggered as a downstream effect.

Recommendation: Increase the database connection pool size and
implement circuit breaker patterns on dependent services.

**Example (json):**
```aql
EXPLAIN err_42 FORMAT json
```

**Output:**
```json
{
  "error_id": "err_42",
  "root_cause": "db_pool_exhausted",
  "confidence": 0.95,
  "chain": ["err_42", "service_timeout", "db_pool_exhausted"],
  "recommendation": "Increase pool size and add circuit breaker."
}
```

---

## Programmatic Usage

```typescript
import { query } from 'afen';

const trace = await query('TRACE err_42 MAX_DEPTH 5');
const cause = await query('CAUSE err_42');
const explain = await query('EXPLAIN err_42 FORMAT json');
```