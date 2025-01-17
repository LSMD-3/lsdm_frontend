import numpy as np
import json
import math
a = np.matrix([
    [28, 0.092],
    [62, 0.137],
    [125, 0.26],
    [246, 0.538],
    [508, 1.08],
    [753, 1.585],
    [1254, 3.102],
    [1606, 3.291],
    [1985, 3.906],
    [2473, 6.414],
    [2984, 7.761]]
)

b = np.matrix([
    [18, 0.047],
    [61, 0.133],
    [119, 0.295],
    [269, 0.571],
    [503, 1.085],
    [736, 1.453],
    [1249, 3.064],
    [1615, 3.103],
    [1969, 5.226],
    [2539, 7.714],
    [2923, 7.868],
]
)

c = np.matrix([
    [29, 0.07],
    [65, 0.146],
    [123, 0.259],
    [247, 0.52],
    [505, 1.161],
    [759, 1.733],
    [1242, 3.564],
    [1650, 4.078],
    [2066, 5.21],
    [2510, 6.534],
    [3060, 9.638]
])

d = np.matrix([
    [24, 0.079],
    [62, 0.149],
    [115, 0.253],
    [258, 0.606],
    [509, 1.018],
    [728, 1.428],
    [1253, 2.805],
    [1615, 3.468],
    [1983, 3.864],
    [2529, 5.484],
    [3025, 7.698],
])


def calculateAverage():
    for (idx, v) in enumerate(a):
        sum = a[idx] + b[idx] + c[idx] + d[idx]
        avg = sum/4
        print(avg)


# 24,75;0,072
# 62,5;0,14125
# 120,5;0,26675
# 255,;0,55875
# 506,25;1,086
# 744,;1,54975
# 1249,5;3,13375
# 1621,5;3,485
# 2000,75;4,5515
# 2512,75;6,5365
# 2998,0;8,24125


def countFrequency(f, scale_factor=1):
    recipes = json.load(f)

    freq = {}
    for _item in recipes:

        item = math.trunc(_item["total"]/scale_factor)
        if (item in freq):
            freq[item] += 1
        else:
            freq[item] = 1

    for key, value in freq.items():
        print("% d : % d" % (key, value))


f1 = open("mostEatenRecipes.json")
f2 = open("userRecipesEatent.json")

countFrequency(f2, 15)
