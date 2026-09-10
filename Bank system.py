balance = 5000
history = []

while True:
    print("\n === BANK SYSTEM ===")
    print("1. Check Balance")
    print("2. Deposit")
    print("3. Withdraw")
    print("4. Transfer")
    print("5. Transaction History")
    print("6. Exit")

    choice = input("Choose an option: ")

    if choice == "1":
        print("Your balance is: $ ", balance)

    elif choice == "2":
        deposite = float(input("Enter amout to deposite"))

        balance = balance + deposite
        history.append("Deposite: $" + str(deposite))

        print("Deposite successful")
        print("Your new balance is: $ ", balance)

    elif choice == "3":
        withdraw = float(input("Enter amount to withdraw: $"))

        if withdraw > balance:
            print("Insufficient balance!")
        else:
            balance = balance - withdraw
            history.append("Withdraw: ₱" + str(withdraw))

            print("Withdrawal successful!")
            print("Your new balance is: $ ", balance)

    elif choice == "4":
        account_name = input("Enter account name: ")
        transfer = float(input("Enter ammount: "))

        if transfer > balance:
            print("Insufficient balance! ")

        else:
            balance = balance - transfer
            history.append("Transfer to " + account_name + ": $" + str(transfer))

            print("Transfer succesful!")
            print("Your new balance is: $ ", balance)

    elif choice == "5":
        print("\n ==== TRANSACTION HISTORY ===")

        if len(history) == 0:
            print("No transaction yes.")

        else:
            for transaction in history:
                print(transaction)

    elif choice == "6":
        print("Thank you for using the Bank System!")
        break

    else:
        print("Invalid option. Please try again.")