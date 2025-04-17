# ForwardJS Raffle

### Description

The ForwardJS Raffle is a Node.js-based application designed to randomly select a winner from a list of participants. It uses a text file containing participant names and provides a fun, animated selection process to determine the winner.

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory:
   ```bash
   cd forwardjs-raffle
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```

### Usage

1. Prepare a text file (e.g., `names.txt`) with one participant name per line.
2. Run the raffle script with the file path as an argument:
   ```bash
   node raffle.js names.txt
   ```
3. Follow the on-screen instructions to start the raffle and see the winner.

### Example

#### Input (`names.txt`):

```
Alice
Bob
Charlie
Diana
```

#### Output:

```
🎉 WINNER 🎉

Charlie

Congratulations to the winner of the JetBrains subscription!
```
