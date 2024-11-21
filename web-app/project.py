import sys
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

data = pd.read_csv('car-dataset.csv')
data['fuel'] = data['fuel'].astype('category').cat.codes 
data['seller_type'] = data['seller_type'].astype('category').cat.codes
data['transmission'] = data['transmission'].astype('category').cat.codes
data['owner'] = data['owner'].astype('category').cat.codes

name_mapping = {name: code for code, name in enumerate(data['name'].astype('category').cat.categories)}
data['name']=data['name'].astype('category').cat.codes

data.fillna(data.mean(), inplace=True)

X = data.drop(columns=['selling_price']).values
y = data['selling_price'].values

X_train,X_test,Y_train,Y_test=train_test_split(X,y,test_size=0.2)

def normalize(X):
    return (X-X.mean())/X.std()

X_train = normalize(X_train)
X_test = normalize(X_test)

def np_add_ones(X):
    ones = np.ones((X.shape[0], 1))
    return np.concatenate((ones, X), axis=1)

X_train = np_add_ones(X_train)
X_test = np_add_ones(X_test)

theta = np.zeros(X_train.shape[1])

def np_hypothesis(X, theta):
    return X.dot(theta)

def np_cost(X, Y, theta):
    m = len(Y)
    return 1 / (2 * m) * np.sum((X.dot(theta) - Y) ** 2)

def np_gradient_descent(X, Y, theta, alpha, iterations, printing=True, convergence=True):
    m = len(Y)
    for i in range(iterations):
        prev_cost = np_cost(X, Y, theta)
        theta = theta - alpha / m * X.T.dot(X.dot(theta) - Y)
        cost = np_cost(X, Y, theta)
        
        percentage_change = (prev_cost - cost) / prev_cost
        if convergence and percentage_change < 0.00002:
            break
            
    return theta

theta = np_gradient_descent(X_train, Y_train, theta, 0.001, 10000)

alpha=[0.001,0.01]
iterations=[10,100,500,1000,5000]


best_alpha,best_iterations,best_cost,best_theta=0,0,float('inf'),np.zeros(X_train.shape[1])

for a in alpha:
    for i in iterations:
        curr_theta=np.zeros(X_train.shape[1])
        curr_theta=np_gradient_descent(X_train,Y_train,curr_theta,a,i,False,False)
        if np_cost(X_train,Y_train,curr_theta)<best_cost:
            best_cost=np_cost(X_test,Y_test,curr_theta)
            best_theta=curr_theta
            best_alpha=a
            best_iterations=i
theta=best_theta

X_test.dot(theta)

def MSE(Y,Y_pred):
    return np.mean((Y-Y_pred)**2)

Y_pred=X_test.dot(theta)

# new_car = np.array([[1041,2017,46000,2,0,1,0]])
# new_car = normalize(new_car)
# new_car = np.insert(new_car,0,1,axis=1)
# predicted_price = new_car.dot(theta)

# raw_input = sys.argv[1].split(',')
raw_data = sys.stdin.read().strip()
raw_input = raw_data.split(',')
input_data = {
        "name": raw_input[0].strip(),
        "year": int(raw_input[1].strip()),
        "km_driven": float(raw_input[2].strip()),
        "fuel": raw_input[3].strip(),
        "seller_type": raw_input[4].strip(),
        "transmission": raw_input[5].strip(),
        "owner": raw_input[6].strip(),
    }


input_data["fuel"] = {"Petrol": 0, "Diesel": 1, "CNG": 2}.get(input_data["fuel"], -1)
input_data["seller_type"] = {"Dealer": 0, "Individual": 1}.get(input_data["seller_type"], -1)
input_data["transmission"] = {"Manual": 0, "Automatic": 1}.get(input_data["transmission"], -1)
input_data["owner"] = {"First": 0, "Second": 1, "Third": 2, "Fourth & Above": 3}.get(input_data["owner"], -1)

car_name = input_data["name"]
input_data["name"] = name_mapping[car_name]
   

input_array = np.array([
        [
            input_data["name"],
            input_data["year"],
            input_data["km_driven"],
            input_data["fuel"],
            input_data["seller_type"],
            input_data["transmission"],
            input_data["owner"],
        ]
    ])

input_array = normalize(input_array)
input_array = np_add_ones(input_array)

predicted_price = input_array.dot(theta)
print(predicted_price[0]) 




