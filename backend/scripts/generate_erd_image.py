import struct, zlib

WIDTH = 800
HEIGHT = 600
BG_COLOR = (255, 255, 255)
LINE_COLOR = (0, 0, 0)
TEXT_COLOR = (0, 0, 0)
BOX_COLOR = (200, 200, 200)

img = [[list(BG_COLOR) for _ in range(WIDTH)] for _ in range(HEIGHT)]

FONT = {
    'A': [
        '01110',
        '10001',
        '10001',
        '11111',
        '10001',
        '10001',
        '10001',
    ],
    'B': [
        '11110',
        '10001',
        '10001',
        '11110',
        '10001',
        '10001',
        '11110',
    ],
    'C': [
        '01111',
        '10000',
        '10000',
        '10000',
        '10000',
        '10000',
        '01111',
    ],
    'D': [
        '11110',
        '10001',
        '10001',
        '10001',
        '10001',
        '10001',
        '11110',
    ],
    'E': [
        '11111',
        '10000',
        '10000',
        '11110',
        '10000',
        '10000',
        '11111',
    ],
    'F': [
        '11111',
        '10000',
        '10000',
        '11110',
        '10000',
        '10000',
        '10000',
    ],
    'G': [
        '01111',
        '10000',
        '10000',
        '10011',
        '10001',
        '10001',
        '01110',
    ],
    'H': [
        '10001',
        '10001',
        '10001',
        '11111',
        '10001',
        '10001',
        '10001',
    ],
    'I': [
        '11111',
        '00100',
        '00100',
        '00100',
        '00100',
        '00100',
        '11111',
    ],
    'J': [
        '00001',
        '00001',
        '00001',
        '00001',
        '10001',
        '10001',
        '01110',
    ],
    'K': [
        '10001',
        '10010',
        '10100',
        '11000',
        '10100',
        '10010',
        '10001',
    ],
    'L': [
        '10000',
        '10000',
        '10000',
        '10000',
        '10000',
        '10000',
        '11111',
    ],
    'M': [
        '10001',
        '11011',
        '10101',
        '10101',
        '10001',
        '10001',
        '10001',
    ],
    'N': [
        '10001',
        '11001',
        '10101',
        '10011',
        '10001',
        '10001',
        '10001',
    ],
    'O': [
        '01110',
        '10001',
        '10001',
        '10001',
        '10001',
        '10001',
        '01110',
    ],
    'P': [
        '11110',
        '10001',
        '10001',
        '11110',
        '10000',
        '10000',
        '10000',
    ],
    'Q': [
        '01110',
        '10001',
        '10001',
        '10001',
        '10101',
        '10010',
        '01101',
    ],
    'R': [
        '11110',
        '10001',
        '10001',
        '11110',
        '10100',
        '10010',
        '10001',
    ],
    'S': [
        '01111',
        '10000',
        '10000',
        '01110',
        '00001',
        '00001',
        '11110',
    ],
    'T': [
        '11111',
        '00100',
        '00100',
        '00100',
        '00100',
        '00100',
        '00100',
    ],
    'U': [
        '10001',
        '10001',
        '10001',
        '10001',
        '10001',
        '10001',
        '01110',
    ],
    'V': [
        '10001',
        '10001',
        '10001',
        '10001',
        '10001',
        '01010',
        '00100',
    ],
    'W': [
        '10001',
        '10001',
        '10001',
        '10101',
        '10101',
        '10101',
        '01010',
    ],
    'X': [
        '10001',
        '10001',
        '01010',
        '00100',
        '01010',
        '10001',
        '10001',
    ],
    'Y': [
        '10001',
        '10001',
        '01010',
        '00100',
        '00100',
        '00100',
        '00100',
    ],
    'Z': [
        '11111',
        '00001',
        '00010',
        '00100',
        '01000',
        '10000',
        '11111',
    ],
    '0': [
        '01110',
        '10001',
        '10011',
        '10101',
        '11001',
        '10001',
        '01110',
    ],
    '1': [
        '00100',
        '01100',
        '00100',
        '00100',
        '00100',
        '00100',
        '01110',
    ],
    '2': [
        '01110',
        '10001',
        '00001',
        '00110',
        '01000',
        '10000',
        '11111',
    ],
    '3': [
        '11110',
        '00001',
        '00001',
        '01110',
        '00001',
        '00001',
        '11110',
    ],
    '4': [
        '00010',
        '00110',
        '01010',
        '10010',
        '11111',
        '00010',
        '00010',
    ],
    '5': [
        '11111',
        '10000',
        '10000',
        '11110',
        '00001',
        '00001',
        '11110',
    ],
    '6': [
        '01110',
        '10000',
        '10000',
        '11110',
        '10001',
        '10001',
        '01110',
    ],
    '7': [
        '11111',
        '00001',
        '00010',
        '00100',
        '01000',
        '10000',
        '10000',
    ],
    '8': [
        '01110',
        '10001',
        '10001',
        '01110',
        '10001',
        '10001',
        '01110',
    ],
    '9': [
        '01110',
        '10001',
        '10001',
        '01111',
        '00001',
        '00001',
        '01110',
    ],
    '_': [
        '00000',
        '00000',
        '00000',
        '00000',
        '00000',
        '00000',
        '11111',
    ],
    '.': [
        '00000',
        '00000',
        '00000',
        '00000',
        '00000',
        '00100',
        '00100',
    ],
    ' ': [
        '00000',
        '00000',
        '00000',
        '00000',
        '00000',
        '00000',
        '00000',
    ]
}

SCALE = 2

def set_pixel(x, y, color):
    if 0 <= x < WIDTH and 0 <= y < HEIGHT:
        img[y][x] = list(color)

def draw_rect(x, y, w, h, color):
    for i in range(x, x+w):
        for j in range(y, y+h):
            set_pixel(i, j, color)

def draw_box(x, y, w, h):
    # fill box
    draw_rect(x, y, w, h, BOX_COLOR)
    # border
    for i in range(w):
        set_pixel(x+i, y, LINE_COLOR)
        set_pixel(x+i, y+h-1, LINE_COLOR)
    for j in range(h):
        set_pixel(x, y+j, LINE_COLOR)
        set_pixel(x+w-1, y+j, LINE_COLOR)

def draw_line(x1, y1, x2, y2, color=LINE_COLOR):
    dx = abs(x2 - x1)
    dy = -abs(y2 - y1)
    sx = 1 if x1 < x2 else -1
    sy = 1 if y1 < y2 else -1
    err = dx + dy
    while True:
        set_pixel(x1, y1, color)
        if x1 == x2 and y1 == y2:
            break
        e2 = 2 * err
        if e2 >= dy:
            err += dy
            x1 += sx
        if e2 <= dx:
            err += dx
            y1 += sy

def draw_char(x, y, ch, color=TEXT_COLOR):
    pattern = FONT.get(ch.upper())
    if not pattern:
        return
    for row, line in enumerate(pattern):
        for col, bit in enumerate(line):
            if bit == '1':
                for dx in range(SCALE):
                    for dy in range(SCALE):
                        set_pixel(x + col*SCALE + dx, y + row*SCALE + dy, color)

def draw_text(x, y, text, color=TEXT_COLOR):
    cx = x
    for ch in text:
        draw_char(cx, y, ch, color)
        cx += (5 + 1) * SCALE

# Table positions
boxes = {
    'public.tenants': (50, 50),
    'public.admin_users': (350, 50),
    'tenant.stations': (50, 200),
    'tenant.pumps': (50, 300),
    'tenant.nozzles': (50, 400),
    'tenant.nozzle_readings': (250, 400),
    'tenant.sales': (450, 400),
    'tenant.fuel_prices': (250, 300),
    'tenant.creditors': (450, 200),
    'tenant.credit_payments': (650, 200),
    'tenant.fuel_deliveries': (450, 300),
    'tenant.day_reconciliations': (650, 300),
}

BOX_W = 150
BOX_H = 40

for name, (bx, by) in boxes.items():
    draw_box(bx, by, BOX_W, BOX_H)
    draw_text(bx + 5, by + 10, name)

# relationships
relations = [
    ('public.tenants', 'tenant.stations'),
    ('tenant.stations', 'tenant.pumps'),
    ('tenant.pumps', 'tenant.nozzles'),
    ('tenant.nozzles', 'tenant.nozzle_readings'),
    ('tenant.nozzle_readings', 'tenant.sales'),
    ('tenant.stations', 'tenant.fuel_prices'),
    ('tenant.stations', 'tenant.fuel_deliveries'),
    ('tenant.stations', 'tenant.day_reconciliations'),
    ('tenant.creditors', 'tenant.credit_payments'),
]

for a, b in relations:
    ax, ay = boxes[a]
    bx, by = boxes[b]
    draw_line(ax + BOX_W//2, ay + BOX_H, bx + BOX_W//2, by, LINE_COLOR)

def save_png(filename):
    raw_data = b''
    for row in img:
        raw_data += b'\x00' + bytes([val for pixel in row for val in pixel])
    compressor = zlib.compressobj()
    compressed = compressor.compress(raw_data)
    compressed += compressor.flush()
    def chunk(tag, data):
        return (struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff))
    with open(filename, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk(b'IHDR', struct.pack('>IIBBBBB', WIDTH, HEIGHT, 8, 2, 0, 0, 0)))
        f.write(chunk(b'IDAT', compressed))
        f.write(chunk(b'IEND', b''))

if __name__ == '__main__':
    save_png('docs/assets/FuelSync_ERD.png')
    print('ERD image generated -> docs/assets/FuelSync_ERD.png')
