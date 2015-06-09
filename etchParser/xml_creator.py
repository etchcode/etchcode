from transformer import transformList
from blocks import *

class xmlcreator:
    def translates(self, string):
        main = transformList(string)
        lists = main.transform()
        print lists.dump()
        result = "<scripts>"
        def combine(listsd):
            res = ""
            for x in listsd:
                res += x
            return res
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
        def exprparser(expr):
            return expr
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

                if function.reginput:

                    for input in function[2]:
                        print input.dump()
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
                result += "</block>"
            result += "</script>"
        result += "</scripts>"
        return result
