class MyData:
    user = "Jack"
    age = 23
    is_alive = True

def DataFn(anyname):
    return print(f'Hello {anyname.user}! You are {anyname.age} years old! And are you ready?')

def Hi():
    res = input("type yes or no: ")
    if res == "yes":
        print("Great!")
    else:
        print("So Sad!")


DataFn(MyData)
Hi()