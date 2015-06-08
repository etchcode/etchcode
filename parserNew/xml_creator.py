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
            result += """<script x="116" y="14"> <block s="receiveGo"/>"""
            script.pop(0)
            for function in script[0][0]:
                result+= '''<block s="''' + createChild(function[0], combine(function[1]))+ '''">'''

                if function.reginput:

                    for input in function[2]:
                        if input.expression:
                            result += str(exprparser(input[0]))
                        elif input.variable:
                            result += '''<block var="'''+ input[0]+ '''"/>'''
                        elif input.func:
                            result += '''<block s="''' + createChild(input[0][0], combine(input[0][1]))+ '''"></block>'''
                        else:
                            result += "<l>"+str(input[0]) +"</l>"
                result += "</block>"
            result += "</script>"
        result += "</scripts>"
        return result
