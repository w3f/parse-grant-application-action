# read-file-action

Read file contents. Forked and adapted from https://github.com/juliangruber/read-file-action

## Usage

```yaml
steps:
  - name: Reads the filled-in application template and parses it
    id: grant_parser
    uses: mmagician/read-file-action@master
    with:
      path: <path to the file>
  - name: Echo outputs
    run: echo ${{ steps.grant_parser.outputs.team_name }}
```

## Building

The file that eventually gets used is `dist/index.js`
After modifying the code, use `npm run build` to update the distribution.

## License

MIT
