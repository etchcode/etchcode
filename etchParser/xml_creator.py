from transformer import transformList
from blocks import *

class xmlcreator:
    def translates(self, string):
        main = transformList(string)
        lists = main.transform()
        print lists.dump()
        result = "<scripts>"
        def exprparser():
            print ""
        def combine(listsd):
            res = ""
            for x in listsd:
                res += x
            return res

        def inputdecider(input):
            result = ""
            if input.expression:

                result += str(exprparser(input[0]))
            elif input.string:
                print "string input"
                print combine(input[0])
                result += "<l>"+str(combine(input[0])) +"</l>"
            elif input.variable:
                result += '''<block var="'''+ input[0].lower()+ '''"/>'''
            elif input.func:
                result += '''<block s="''' + createChild(input[0][0].lower(), combine(input[0][1]).lower())+ '''"></block>'''
            else:
                result += "<l>"+str(input[0]) +"</l>"
            return result
        def createChild(parent, child):
            try:
                return snapNames[parent][child]
            except KeyError:
                try:
                    return snapNames[abriviations[parent]][child]
                except KeyError:

                    print parent
                    print child
                    print "unreconized function " + str(parent) + " " + str(child)
                    return "sam"
        def exprBlockMaker(lists, expression):
            result = '''<block s="''' + createChild("operators", expression)+ '''">'''
            if len(lists[0]) == 1:
                result += inputdecider(lists[0])
            else: #if there is another nested expression
                result += exprparser(lists[0])
            if len(lists) == 2:
                if len(lists[1]) == 1:
                    result += inputdecider(lists[1])
                else:
                    result += exprparser(lists[1])
            else:
                lists.pop(0)
                result += exprBlockMaker(lists, expression)

            result += "</block>"
            return result
        def exprparser(expr): #this function parses expressions.
            result = ""
            counter = 1
            print expr
            expression = expr[1]
            try:
                while True:
                    expr.pop(counter)
                    counter += 1

            except IndexError:
                print ""
            result += exprBlockMaker(expr, expression)
            return result
        #print lists.scriptblock.functions[1].dump()
        for script in lists:
            result += """<script x="116" y="14">"""

            try:
                print "startcode"
                print script[0]
                script[0][2]
                result+= '''<block s="''' + createChild(script[0][0].lower(), combine(script[0][1]).lower())+ '''">'''
                result += "<l><option>"+script[3].lower()+"</option></l></block>"
            except IndexError:
                startcode =createChild(script[0][0].lower(), combine(script[0][1]).lower())
                if startcode != "receiveGo":
                    print "This should raise a startcode error"
                result+= '''<block s="''' + startcode+ '''"/>'''
            script.pop(0)
            for function in script:

                result+= '''<block s="''' + createChild(function[0].lower(), combine(function[1]).lower())+ '''">'''



                for input in function[2]:
                    result += inputdecider(input)

                result += "</block>"
            result += "</script>"
        result += "</scripts>"
        return result
