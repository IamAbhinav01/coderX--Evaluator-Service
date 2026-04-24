Viewed cppExecutor.ts:1-90

To calculate the exact time (execution speed) and space (memory) complexity of the user's code, you should measure it **inside** the Docker container.

If you try to measure the time using `performance.now()` in Node.js, it will be inaccurate because it includes the time it takes Docker to spin up and shut down the container.

The standard way to do this in Competitive Programming evaluators is to wrap the execution with the Linux `/usr/bin/time` utility.

Here is how you can easily implement this in your `cppExecutor.ts`:

### 1. Update the Docker Command

Modify the `bash -c` command array that runs the code. Instead of just `./main`, use `/usr/bin/time` with a custom format string to output the execution time and max memory usage.

```typescript
const cppDockerContainer = await createContainer(CPP_IMAGE, [
  'bash',
  '-c',
  `cat <<EOF > main.cpp
${code}
EOF
g++ main.cpp -o main
# This runs the code and prints [TIME_IN_SECONDS] [MEMORY_IN_KB] to stderr
/usr/bin/time -f "%e %M" printf "${inputCase}" | ./main`,
]);
```

- `%e`: Prints the elapsed real time in seconds (e.g., `0.05`).
- `%M`: Prints the maximum resident set size (memory used) in Kilobytes (e.g., `4500`).

### 2. Parse the Output

`/usr/bin/time` will print the metrics to the **stderr** stream. When you parse your `decodedStream` in `fetchDecodeStream()`, you can extract it!

Because it prints to `stderr`, your current code will think it's an error because `if (decodedStream.stderr)` will be triggered. You'll need to modify your logic to extract the time and memory from the bottom of the stderr string, and only reject if there are _actual_ compilation/runtime errors.

### Example parsing logic:

```typescript
const stderrString = decodedStream.stderr.trim();
const stderrLines = stderrString.split('\n');

// The last line of stderr will be our metrics like "0.02 1256"
const metricsLine = stderrLines.pop();
const [timeSeconds, memoryKb] = metricsLine.split(' ');

console.log(`Execution Time: ${timeSeconds}s`);
console.log(`Peak Memory: ${memoryKb}KB`);

// If there was actual error output before the metrics line, then it's a real error
const actualErrors = stderrLines.join('\n');
if (actualErrors.length > 0) {
  rej(actualErrors);
} else {
  // Return stdout along with metrics
  res({
    output: decodedStream.stdout,
    time: Number(timeSeconds),
    memory: Number(memoryKb),
  });
}
```

### Why this is the best approach:

1. **Accurate Time**: It measures only the exact duration `./main` was running, ignoring Docker startup overhead.
2. **Accurate Space**: It hooks into the Linux kernel to grab the exact peak RAM (`Max RSS`) the C++ process consumed.
3. **Language Agnostic**: You can use this exact same `/usr/bin/time -f "%e %M" python3 main.py` approach for your `pythonExecutor.ts` and `javaExecutor.ts`!
