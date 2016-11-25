import requests
import re
import time
file=open('result.html', 'w')
file.write('<!DOCTYPE html>\n')
file.write('<html><head><meta http-equiv="Content-Type" content="text/html" charset=UTF-8"></head><body>')
now=int(time.time())*1000

country = "us"
category_id="34"
city="New York"
state="NY"




r=requests.get('https://api.meetup.com/2/concierge?key=687717166a6b43701f1c6b103822620&sign=true&photo-host=public&country='+country+'&city='+city+'&category_id='+category_id+'&state='+state)
name=re.findall(r'"name":"([\w\d\ \(\)\:\&\,\.\@\!\#\'\+\/\-]+)","id":"[\w ]+","time"', r.text)
adress_l=re.findall(r'"address_1":"([\w\ \.\&]+)"', r.text)
t=re.findall(r'"name":"[\w\d\ \(\)\:\&\,\.\@\!\#\'\+\/\-]+","id":"[\w ]+","time":([\d]+)', r.text)
print(name)
print(adress_l)
print(t)
for i in range(7):
    file.write( str(i+1) +' day: \n<ul>\n') #1 день с запуска программы +24 часа. 2ой день с +24 до +48
    for j in range(len(t)):
        if (int(t[j])<((i+1)*86400000+now)) and (int(t[j])>(i*86400000+now)): #86400000 это 24 часа ибо сутки надо выделять.
            t2=time.strftime("%a, %d %b %Y %H:%M:%S", time.localtime(float(t[j])/1000-43200))   #43200 это 12 часов ибо разница с городом в 14 часов
            file.write('<li>' + str(t2) + ',<br> ' + str(name[j]) + ',<br> ' + str(adress_l[j]) + '</li>\n')
    file.write('</ul>\n')
file.write('</body></html>')
