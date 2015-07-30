from transformer import transformList
from blocks import *
from errors import *
from pyparsing import ParseException
import re
class xmlcreator:
    def translates(self, string, variables, sprites):

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
        def variableChecker(variable, variables):
            for x in variables:
                if x == variable:
                    return True
            return False
        """This decides which input type it is and decides what to add to results
        input: input which is contained with in a list
        output: xml to add to results"""
        def inputdecider(input, option = False):


            result = ""
            if option:
                result += "<l><option>"+str(input[0]) +"</option></l>"
            elif input.expression:
                result += str(exprParser(input[0]))
            elif input.string:
                # print "string input"
                # print combine(input[0])
                result += "<l>"+str(combine(input[0])) +"</l>"
            elif input.variable:
                result += '''<block var="'''+ input[0].lower()+ '''"/>'''
            elif input.func:
                result += '''<block s="''' + createChild(input[0][0].lower(), combine(input[0][1]).lower(), False)+ '''"></block>'''
            else:
                result += "<l>"+str(input[0]) +"</l>"
            return result
        """
        this function searches blocks data base for a match. Catching any errors.
        input: parent and a child both are strings all lower case ifmaster is a bolian that refers to if it is a first function
        output: name for of snap block referenceing
         """
        def createChild(parent, child, ifmaster):
            current_function = ""
            # print parent
            # print child
            try:

                if ifmaster:
                    return snapNames[parent][child]
                    current_function = snapNames[parent][child]
                return snapNames[parent][child]["snap"] #if it not a abriviated parent name like (c for control)
            except KeyError:
                try:
                    test = snapNames[abriviations[parent]][child]
                    if ifmaster:
                        return test

                    return test["snap"]#if it is abriviated
                except KeyError:

                    raise unreconizedFunction(str(parent) + "." + str(child))

        """
        This function parses expressions like 12+213*m.xpos into xml
        input: a list of all the inputs nest for order of operations for example this 12+213*m.xpos
        equals this[[213], '*', [['m', ['xpos']]]]
        output: is xml that snap can process

        """
        def exprParser(lists): #this function parses expressions.

            expression = lists[1]
            result = '''<block s="''' + createChild("operators", expression, True

                                                )+ '''">''' # this adds the operator block
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
        try:
            main = transformList(string) # parses string into a list that we can creat xml from
            lists = main.transform()
            print lists
        except ParseException as error:
            match = re.match(r"(.*?) \(at char ([0-9]*)\), \(line\:([0-9]*)", str(error))

            return {
                "error": True,
                "message": match.group(1),
                "lineNumber": match.group(2),
                "column": match.group(3)
            }


        #print lists.dump()
        result = "<scripts>" #starts the master results

        for script in lists:
            result += """<script x="116" y="14">""" #adds where the script will be placed

            try:                                    # adds the begining of the program
                # print "startcode"
                # print script[0]
                script[0][2]
                result+= '''<block s="''' + createChild(script[0][0].lower(), combine(script[0][1]).lower(), False)+ '''">'''
                result += "<l><option>"+script[3].lower()+"</option></l></block>"
            except IndexError:                       # we need this because receiveGo is self closing and the other ones aren't
                startcode =createChild(script[0][0].lower(), combine(script[0][1]).lower(), False)
                if startcode != "receiveGo":
                    raise unreconizedFunction(str(script[0][0])+ "." + str(combine(script[0][1])))
                result+= '''<block s="''' + startcode + '''"/>'''
            script.pop(0)
            for function in script: # this creates xml for all the functions


                functionname =createChild(function[0].lower(), combine(function[1]).lower(), True)
                result+= '''<block s="''' +functionname["snap"] + '''">''' #this creates the function block


                num = 0

                for input in function[2]: #this creates xml for all the inputs


                    lineNumber = input[1]

                    input = input[0]

                    try:
                        """This checks if a input is the correct type for the function"""
                        if (input.integer and "integer" == functionname["inputs"][num][0]):
                            result += inputdecider(input)
                        elif (input.string and "string" == functionname["inputs"][num][0]):
                            result += inputdecider(input)
                        elif (input.expression and "integer" == functionname["inputs"][num][0]):
                            result += inputdecider(input)
                        elif (input.func and "integer" == functionname["inputs"][num][0]):
                            result += inputdecider(input)
                        elif input.variable:
                            if (not variableChecker(input[0], variables)) and (functionname["inputs"][num][1]) and variableChecker(input[0], sprites): #if it needs the option syntax isn't sprite or variable
                                result += inputdecider(input, option = True)
                            elif variableChecker(input[0], variables) and not functionname["inputs"][num][1]: #if it is a variable
                                result += inputdecider(input)
                            elif variableChecker(input[0], sprites) and functionname["inputs"][num][1]:
                                result += inputdecider(input)
                            elif not variableChecker(input[0], variables) and not functionname["inputs"][num][1] and not variableChecker(input[0], sprites):
                                error =("On function " + str(function[0]) +"."+str(combine(function[1]))+" unreconized variable or sprite" + input[0])
                                return  {"message": error, "error": True, "lineNumber": lineNumber}
                            else:
                                error = ("On function " + str(function[0]) +"."+str(combine(function[1]))+" with input " + str(input[0]) + " needs to be a "+ str(functionname["inputs"][num][0]))
                                return  {"message": error, "error": True, "lineNumber": lineNumber}


                        else:
                            error =("On function " + str(function[0]) +"."+str(combine(function[1]))+" with input " + str(input[0]) + " needs to be a "+ str(functionname["inputs"][num][0]))
                            return  {"message": error, "error": True, "lineNumber": lineNumber}
                        num += 1
                    except IndexError:
                        error = ("On function " + str(function[0]) +"."+str(combine(function[1]))+" too many inputs " + str(len(functionname["inputs"]))+ " required")
                        return  {"message": error, "error": True, "lineNumber": lineNumber}
                result += "</block>"
            result += "</script>"
        result += "</scripts>"

        return  {"error": False, "code": result}
