import tkinter as tk
import json
import random

with open("jsonfiles/section1.json", "r") as f:
    flashcards = json.load(f)

# Initialize window
root = tk.Tk()
root.title("Flashcard Test App")
root.geometry("500x500")

# Dark mode colors
bg_color = "#2E2E2E"  # Dark background
fg_color = "#FFFFFF"  # White text
button_color = "#444444"  # Darker buttons

root.configure(bg=bg_color)

# Variables
current_card = random.choice(flashcards)

# UI Elements
card_text = tk.Label(root, text=current_card["question"], font=("Arial", 16), wraplength=300, fg=fg_color, bg=bg_color)
card_text.pack(pady=20)

answer_entry = tk.Entry(root, font=("Arial", 14), bg=button_color, fg=fg_color)
answer_entry.pack(pady=10)

feedback_label = tk.Label(root, text="", font=("Arial", 12), fg=fg_color, bg=bg_color)
feedback_label.pack()


def check_answer():
    user_answer = answer_entry.get().strip().lower()
    correct_answer = current_card["answer"].lower()
    if user_answer == correct_answer:
        feedback_label.config(text="✅ Correct!", fg="lightgreen")
    else:
        feedback_label.config(text=f"❌ Incorrect! Answer: {current_card['answer']}", fg="red")


check_button = tk.Button(root, text="Check", command=check_answer, bg=button_color, fg=fg_color)
check_button.pack(pady=10)


def next_card():
    global current_card
    current_card = random.choice(flashcards)
    card_text.config(text=current_card["question"])
    answer_entry.delete(0, tk.END)
    feedback_label.config(text="")


next_button = tk.Button(root, text="Next", command=next_card, bg=button_color, fg=fg_color)
next_button.pack(pady=10)

root.mainloop()
