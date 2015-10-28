### Etch is a written language

In Etch, you write out your code instead of dragging blocks in. For instance, in Scratch a simple program to say "Hello World" would look like this:

![Scratch Hello World](images/scratch_hello_world.png)

In Etch, the same program would be written

	flag clicked:
		say("Hello World")
	
### Every block in Scratch directly corresponds with a few words in Etch

As you can see, every block in Scratch directly corresponds with a few words in Etch. After a while, you will learn the words and will not need to look them up. However, at the beginning you can drag the blocks listed next to the editor into your code.
	
### Basic data types

The basic data types are strings and numbers (A string is a group of text). To make something a string, just put it in quotes. As you saw above, to make the sprite say `Hello World` you need write `"Hello World"`. To write a number, you don't have to do anything special. A dropdown menu choice that would be built into Scratch, such as the option `ghost` for `Looks.set effect("ghost", 20)`, would be written as a string (like `"ghost"`). 

### Block Types
	
In Scratch, you have blocks that represent a string or number (like the block for the mouse position) and blocks that do something (like move the sprite). In Etch, blocks that represent strings or numbers are written as just the words (`mouse x`). Blocks that do things are written with parentheses (`if edge bounce()`).

Blocks that are headers, like `Control.when flag clicked`, have colons (":") after them. Any blocks that would be attatched to them are indented. For instance

	flag clicked:
		say("Hello World")
		
		forever:
			move(10)

### Telling blocks things
	
Blocks can be told things by putting what you want to tell them in the parenthesis.

	move(10)

To tell a block multiple things, seperate them things that you want to tell them with commas.

	pick random between(1, 3)

Blocks can be told numbers, strings, or the result of other blocks.

* Number: `move(10 + 5)`
* Strings : `say("Hello World")`
* Result of other blocks: `say(pick random between(1, 3))`

### Multiple Groups of Blocks

In Scratch, you can have multiple parallel groups of blocks. For instance,

![Scratch Hello World with Threading](images/scratch_hello_world_threading.png)

In Etch, you can't write multiple groups side by side. Instead, you would write it like this

	flag clicked:
		say("Hello World")
 	
	key pressed(space):
		think("Even though you can be cruel")
