import json

if __name__ == '__main__':
    array = []
    with open('fragen_10_06_21_final.json') as file:
        data = json.load(file)
        print(len(data))

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

            array.append(new)

    with open('fragen_10_06_21_final_new_format.json', 'w', encoding='utf8') as file:
        json.dump(array, file, ensure_ascii=False)
        print(len(data))
