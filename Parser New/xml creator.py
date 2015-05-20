from translator import transformList


main = transformList("""events.whenflag Clicked: events.hi g(2+3*x.ty re*21) events.hi as(2+3*x.ty re*21)
events.flag Clicked: events.hi g(2+3*x.ty re*21)
 """)
print main.transform()