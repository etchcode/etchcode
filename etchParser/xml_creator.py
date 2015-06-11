from transformer import transformList
from blocks import *
from errors import *
class xmlcreator:
    def translates(self, string):
        """
        Combines the words together in for functions
        listsd is a list of strings
        output is a string of the combined list
        """
        def combine(listsd):
            res = ""
            for x in listsd:
                res += x
            return res
        """This decides which input type it is and decides what to add to results
        input: input which is contained with in a list
        output: xml to add to results"""
        def inputdecider(input):
            result = ""
            if input.expression:

                result += str(exprParser(input[0]))
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
        """
        this function searches blocks data base for a match. Catching any errors.
        input: parent and a child both are strings all lower case
        output: name for of snap block referenceing
         """
        def createChild(parent, child):
            try:
                return snapNames[parent][child] #if it not a abriviated parent name like (c for control)
            except KeyError:
                try:
                    return snapNames[abriviations[parent]][child] #if it is abriviated
                except KeyError:

                    print parent
                    print child
                    raise unreconizedFunction(str(parent) + "." + str(child))

        """
        This function parses expressions like 12+213*m.xpos into xml
        input: a list of all the inputs nest for order of operations for example this 12+213*m.xpos
        equals this[[213], '*', [['m', ['xpos']]]]
        output: is xml that snap can process

        """
        def exprParser(lists): #this function parses expressions.

            expression = lists[1]
            result = '''<block s="''' + createChild("operators", expression)+ '''">''' # this adds the operator block
            if len(lists[0]) == 1:
                result += inputdecider(lists[0])
            else:                       # if there is another nested expression as the first part
                result += exprParser(lists[0])
            if len(lists) == 3:
                if len(lists[2]) == 1:
                    result += inputdecider(lists[2])
                else:                      # if there is another nested expression as the second part
                    result += exprParser(lists[2])
            else:
                lists.pop(0)                 # this takes away what we have already parsed
                lists.pop(0)
                result += exprParser(lists)  # passes it to the exprParser again to parse the next equation

            result += "</block>"
            return result

        main = transformList(string) # parses string into a list that we can creat xml from
        lists = main.transform()

        #print lists.dump()
        result = "<scripts>" #starts the master results
        #print lists.scriptblock.functions[1].dump()
        for script in lists:
            result += """<script x="116" y="14">""" #adds where the script will be placed

            try:                                    # adds the begining of the program
                # print "startcode"
                # print script[0]
                script[0][2]
                result+= '''<block s="''' + createChild(script[0][0].lower(), combine(script[0][1]).lower())+ '''">'''
                result += "<l><option>"+script[3].lower()+"</option></l></block>"
            except IndexError:                       # we need this because receiveGo is self closing and the other ones aren't
                startcode =createChild(script[0][0].lower(), combine(script[0][1]).lower())
                if startcode != "receiveGo":
                    raise unreconizedFunction(str(script[0][0])+ "." + str(combine(script[0][1])))
                result+= '''<block s="''' + startcode + '''"/>'''
            script.pop(0)
            for function in script: # this creates xml for all the functions
                print function
                result+= '''<block s="''' + createChild(function[0].lower(), combine(function[1]).lower())+ '''">''' #this creates the function block



                for input in function[2]: #this creates xml for all the inputs
                    result += inputdecider(input)

                result += "</block>"
            result += "</script>"
        result += "</scripts>"
        return result
