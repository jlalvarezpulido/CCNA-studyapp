import random
import json
import os

with open("jsonfiles/section1.json", "r") as f:
    json_data = json.load(f)

low_mastery = []
normal_mastery = []
high_mastery = []
for entry in json_data:
    value = entry.get("mastery")
    if value < 0:
        low_mastery.append(entry)
    elif 0 <= value < 3:
        normal_mastery.append(entry)
    else:
        high_mastery.append(entry)

def challenge():

    random_mastery = random.randint(1,10)
    # Mapping priority order based on random_mastery value
    mastery_options = [
            # random_mastery < 4
            [low_mastery, normal_mastery, high_mastery],  
            # random_mastery < 7
            [high_mastery, normal_mastery, low_mastery],  
            # random_mastery >= 7
            [normal_mastery, low_mastery, high_mastery]   
    ]

    # Determine which priority order to use
    index = 0 if random_mastery < 4 else 1 if random_mastery < 7 else 2

    # Select the first non-empty list
    data = next((lst for lst in mastery_options[index] if lst), None)

    if data is None:
        print("ERROR: no questions loaded from JSON file")
    random_number = random.randint(0, len(data) - 1)

    ques = f'{data[random_number]["question"]}\n#'
    res = input(ques).upper()

    if res == str(data[random_number]["answer"]):
        data[random_number]["mastery"] += 1
        print("correct")
        print(data[random_number]["notes"])
        print(f'mastery++ :{data[random_number]["mastery"]}\n')

        if data[random_number]["mastery"] < 0:
            low_mastery.append(data[random_number])
            del data[random_number]

        elif 0 <= data[random_number]["mastery"] < 3:
            normal_mastery.append(data[random_number])
            del data[random_number]

        else:
            high_mastery.append(data[random_number])
            del data[random_number]
    else:
        data[random_number]["mastery"] -= 1
        print("incorrect")
        print(f'mastery-- :{data[random_number]["mastery"]}\n')
        print("answer ", data[random_number]["answer"])
        print(data[random_number]["notes"])

        if data[random_number]["mastery"] < 0:
            low_mastery.append(data[random_number])
            del data[random_number]

        elif 0 <= data[random_number]["mastery"] < 3:
            normal_mastery.append(data[random_number])
            del data[random_number]

        else:
            high_mastery.append(data[random_number])
            del data[random_number]
        print("\n")

loop = True
loop_count = 0
while loop:

    if loop_count < 1:
        print("for more info type help")
        print("welcome to the study TTY app, please enter your command:")

    status = input("#")
    match status:

        case "help":
            print("commands below")
            print("chal - take on a challenge (port question)")
            print("exit - exit app")
            print("clear - clear screen")

        case "chal":
            challenge()

        case "debug h":
            print(high_mastery)

        case "debug n":
            print(normal_mastery)

        case "debug l":
            print(low_mastery)

        case "clear":
            os.system('cls' if os.name == 'nt' else 'clear')

        case "exit":
            loop = False

        case _:
            print("Unknown command")

    loop_count += 1
