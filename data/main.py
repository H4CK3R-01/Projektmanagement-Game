import json

if __name__ == '__main__':
    array = []
    with open('fragen_10_06_21_final.json') as file:
        data = json.load(file)

        length_q = 0
        id_q = 0
        length = 0
        id = 0
        for i in range(0, len(data)):
            new = {'id': int(data[i]['id']), 'difficulty': int(data[i]['difficulty']), 'question': data[i]['question'],
                   'answers': []}

            new['answers'].append({"text": data[i]['A'],
                                   "status": 'A' == data[i]['key']
                                   })
            new['answers'].append({"text": data[i]['B'],
                                   "status": 'B' == data[i]['key']
                                   })
            new['answers'].append({"text": data[i]['C'],
                                   "status": 'C' == data[i]['key']
                                   })
            new['answers'].append({"text": data[i]['D'],
                                   "status": 'D' == data[i]['key']
                                   })


            if(length_q < len(data[i]['question'])):
                length_q = len(data[i]['question'])


            if(length < len(data[i]['A'])):
                length = len(data[i]['A'])
            if(length < len(data[i]['B'])):
                length = len(data[i]['B'])
            if(length < len(data[i]['C'])):
                length = len(data[i]['C'])
            if(length < len(data[i]['D'])):
                length = len(data[i]['D'])

            array.append(new)

    print("Längste Frage: " + str(length))
    print("Längste Antwort: " + str(length_q))

    with open('fragen_10_06_21_final.json') as file:
        data = json.load(file)

        for i in range(0, len(data)):
            if(length_q == len(data[i]['question'])):
                print("Längste Frage ID: " + str(data[i]['id']))

            if(length == len(data[i]['A']) or length == len(data[i]['B']) or length == len(data[i]['C']) or length == len(data[i]['D'])):
                print("Längste Antwort ID: " + str(data[i]['id']))

    with open('fragen_10_06_21_final_new_format.json', 'w', encoding='utf8') as file:
        json.dump(array, file, ensure_ascii=False)
