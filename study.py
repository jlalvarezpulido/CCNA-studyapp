import random
import json
import os
import textwrap

class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BRIGHT_CYAN = '\033[96m'
    RESET = '\033[0m'

json_path = "jsonfiles/section1.json"
with open(json_path, "r") as f:
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

def save():
    save_data = low_mastery + normal_mastery + high_mastery
    with open(json_path, "w") as f:
        json.dump(save_data, f, indent=4)

def reset():
    save_data = low_mastery + normal_mastery + high_mastery
    for entry in save_data:
        entry["mastery"] = 0
    with open(json_path, "w") as f:
        json.dump(save_data, f, indent=4)

def challenge():
    
    random_mastery = random.randint(1,100)
    #percents are rounded down in steps of 1% ie. .255 => 25%
    LM_PERCENT = 0.45 
    HM_PERCENT = 0.03
    # Mapping priority order based on random_mastery value
    mastery_options = [
            # random_mastery < LM_PERCENT * 10
            [low_mastery, normal_mastery, high_mastery],  
            # random_mastery < (LM_PERCENT + HM_PERCENT) * 10
            [high_mastery, normal_mastery, low_mastery],  
            # random_mastery >= 7
            [normal_mastery, low_mastery, high_mastery]   
    ]

    # Determine which priority order to use
    index = 0 if random_mastery <= LM_PERCENT * 100 else 1 if random_mastery <= (LM_PERCENT + HM_PERCENT) * 100 else 2

    # Select the first non-empty list
    data = next((lst for lst in mastery_options[index] if lst), None)

    if data is None:
        print("ERROR: no questions loaded from JSON file")
    random_section = random.randint(0, 3)
    random_number = 0 if random_section == 0 else len(data) // 6 if random_section == 1 else 3 * len(data) // 6 if random_section == 2 else 5 * len(data) // 6

    ques = f'{data[random_number]["question"]}\n'
    wrapped_ques = textwrap.fill(ques, width=70, break_long_words=False, break_on_hyphens=False)
    res = input(wrapped_ques + f"{Colors.BRIGHT_CYAN}\n#").upper()
    if res == str(data[random_number]["answer"]).upper():
        data[random_number]["mastery"] += 1
        print(f"{Colors.GREEN}correct{Colors.RESET}")
        print(textwrap.fill(data[random_number]["notes"], width=70, break_long_words=False, break_on_hyphens=False))
        print(f'{Colors.BLUE}mastery++ :{data[random_number]["mastery"]}\n{Colors.RESET}')
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
        print(f"{Colors.RED}incorrect\n{Colors.RESET}")
        print(f'{Colors.YELLOW}mastery-- :{data[random_number]["mastery"]}\n{Colors.RESET}')
        print("answer ", data[random_number]["answer"])
        print(textwrap.fill(data[random_number]["notes"], width=70, break_long_words=False, break_on_hyphens=False))

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
        print(f"{Colors.BLUE}Welcome to the study TTY app, Take on callenges and level up your mastery\nplease enter your command:{Colors.RESET}")

    status = input("for help type help\n#")
    match status:

        case "help":
            print(f"{Colors.BLUE}commands below:\nchal - take on a challenge (review question\nsave - exit app saving mastery data\nexit - exit app without saving\nreset - reset all masteries and exit\nclear - clear screen{Colors.RESET}")

        case "chal":
            challenge()

        case "debug":
            print(f"high_mastery: {len(high_mastery)}")
            print(f"normal_mastery: {len(normal_mastery)}")
            print(f"low_mastery: {len(low_mastery)}")

        case "clear":
            os.system('cls' if os.name == 'nt' else 'clear')

        case "exit":
            loop = False

        case "reset":
            reset_auth = input(f"{Colors.YELLOW}Are you sure you would like to delete progress\n(y - for yes)#{Colors.RESET}")
            if reset_auth.upper() == "Y":
                reset()
                loop = False

        case "save":
            save()
            loop = False

        case _:
            print(f"{Colors.RED}Unknown command{Colors.RESET}")

    loop_count += 1
