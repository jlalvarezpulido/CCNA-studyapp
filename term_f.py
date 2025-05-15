import textwrap

def terminal_format(text, size):
    wrapped_ques = textwrap.fill(text, width=size, break_long_words=False, break_on_hyphens=False)
    return wrapped_ques
