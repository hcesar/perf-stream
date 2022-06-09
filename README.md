This is a streaming test. It shows the impact of streaming (or not) on the server memory.
It fetches the data from an external server and process it, returning just the calculated value (since we are not interested on testing the response itself).

- Install WRK (https://github.com/wg/wrk)
- Run yarn to install dependencies
- In terminal 1 you run `yarn start:source` that will act as the source server for our testing server
- In terminal 2 you run `yarn start` to start the server we are testing
- In terminal 3 you run the test commands `wrk:stream:big`, `wrk:stream:small`, `wrk:json:big`, `wrk:json:big`,

The 4 tests will test the permutations of testing streaming or json parsing the source, and also while the source is a small or a big file.
You can tweak -c and -t params on package.json