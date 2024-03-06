import hashlib

def encodeHash(var):
    key = open('./key.txt', 'rb').readline().decode('utf8')
    return hashlib.sha256(f'{var}{key}SEON'.encode('utf8'),usedforsecurity=True).hexdigest()

if __name__ == '__main__':
    print(encodeHash(input(': ')))