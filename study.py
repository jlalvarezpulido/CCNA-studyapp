import random
import json
import os

loop_count = 0
loop = True

with open("jsonfiles/section1.json", "r") as f:
    data = json.load(f)


def challenge():
    random_number = random.randint(0, len(data) - 1)
    ques = data[random_number]["question"] + "\n" + "#"
    res = input(ques).upper()
    if res == data[random_number]["answer"]:
        data[random_number]["mastery"] += 1
        print("correct")
        print(data[random_number]["notes"])
        print(f'mastery++ :{data[random_number]["mastery"]}')
        print("\n")
    else:
        data[random_number]["mastery"] -= 1
        print("incorrect")
        print(f'mastery-- :{data[random_number]["mastery"]}\n')
        print("answer ", data[random_number]["answer"])
        print(data[random_number]["notes"])
        print("\n")


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
        case "clear":
            os.system('cls' if os.name == 'nt' else 'clear')
        case "exit":
            loop = False
        case _:
            print("Unknown command")
    loop_count += 1
