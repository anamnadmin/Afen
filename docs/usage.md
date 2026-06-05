# Afen Usage Guide

## Installation

```bash
git clone https://github.com/v-1908/Afen.git
cd Afen
npm install
npm run build
```

## Running

```bash
npm start
# or
node dist/index.js
```

## Queries

### CLI
```bash
afen query --file query.aql
```

### Programmatic
```typescript
import { query } from 'afen';

const result = await query('TRACE err_42 MAX_DEPTH 5');
console.log(result);
```

## Benchmarks

```bash
npm run bench
```

See [docs/benchmarks.md](./benchmarks.md) for expected metrics.

## Development

| Command         | Description                  |
|-----------------|------------------------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run lint`  | Run ESLint across `src/`     |
| `npm run test`  | Run test suite               |
| `npm run bench` | Run performance benchmarks   |

## Configuration

Create a `.env` file in the project root:

```env
NODE_ENV=development
LOG_LEVEL=info
PORT=3000
```

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: description"`
4. Push and open a Pull Request.
5. Ensure `npm run lint` and `npm run build` pass before submitting.

## License

MIT — see [LICENSE](../LICENSE).