"""
Super echo program
When echo isn't enough.
"""
import sys
import HTMLParser

class Echo:
	args = ''
	h = HTMLParser.HTMLParser()
	def __init__(self, args): # Stdin mode.
		if(len(args) < 2):
			for line in sys.stdin:
				print(self.h.unescape(line.rstrip('\n')))
			sys.exit(0)

		if args[1][0] == 'a': # Array argument mode.
			lines = args[2].split(',')
			for line in lines:
				print(self.h.unescape(line))
		else:
			for i in range(1, len(args)): # Argument mode.
				if i == 1: self.args += args[i]
				else: self.args += ' ' + args[i]
			print(self.h.unsescape(self.args))

if __name__ == '__main__':
	Echo(sys.argv)
