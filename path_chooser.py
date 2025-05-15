import curses
import os

def path_chooser(stdscr):
    curses.curs_set(0)  # Hide cursor
    stdscr.keypad(True)  # Enable special keys
    stdscr.clear()
    
    current_path = os.getcwd()
    json_path = current_path + "/jsonfiles"
    items = sorted(os.listdir(json_path))
    selected = 0

    while True:
        stdscr.clear()
        stdscr.addstr(0, 0, f"Section location: {json_path}")

        for i, item in enumerate(items):
            if i == selected:
                stdscr.addstr(i+1, 0, f"> {item}", curses.A_REVERSE)
            else:
                stdscr.addstr(i+1, 0, f"  {item}")

        key = stdscr.getch()
        if key == curses.KEY_DOWN and selected < len(items) - 1:
            selected += 1
        elif key == curses.KEY_UP and selected > 0:
            selected -= 1
        elif key == ord('\n'):
            chosen_path = os.path.join(json_path, items[selected])
            break

    return chosen_path


