import json
import io

if __name__ == '__main__':
    array = []
    with io.open('fragen_12_07_21.json', 'r', encoding='utf-8-sig') as file:
        data = json.load(file)

        for i in range(0, len(data)):
            new = { 'id': int(data[i]['ID']), 'difficulty': int(data[i]['Schwierigkeit']), 'question': data[i]['Frage'], 'answers': [] }

            new['answers'].append({"text": data[i]['A'], "status": 'A' == data[i]['Key']})
            new['answers'].append({"text": data[i]['B'], "status": 'B' == data[i]['Key']})
            new['answers'].append({"text": data[i]['C'], "status": 'C' == data[i]['Key']})
            new['answers'].append({"text": data[i]['D'], "status": 'D' == data[i]['Key']})
            array.append(new)

    with open('fragen_12_07_21_new_format.json', 'w', encoding='utf8') as file:
        json.dump(array, file, ensure_ascii=False)
