# T24 Sensitive Logic (Client Overrides)
> **CONFIDENTIALITY NOTICE:** This file contains exact client specification logic, user story overrides, and sensitive banking execution flows. It is strictly sandboxed for Local RAG parsing and MUST NOT be loaded into the Oracle Cloud Chatbot.

## WF-8185 - Automated Services for Guarantee Updates- LBK.SOLDARE.GARANTII
*   **Routine Action:** Liquidates guarantees after the liquidation of the attached loans or deposits.
*   **Conditions:** Must select all guarantees where `VAL.EVAL.INT > 0` AND there are no active LD (Loans) or PD (Deposits) records attached.
*   **Updates:** 
    *   `NOMINAL.VALUE = 0`
    *   `VAL.EVAL.INT = 0`
    *   `EXPIRY.DATE = TODAY`
*   **Matrix Rule:** Since this is a liquidation closure, testing must ensure that all balances evaluate precisely to zero. Include Positive, Negative, and Edge Case locks across PF, PJ, and PRE.

## WF-8178 - Automated Services for Guarantee Updates - LBK.ACTUALIZARE.CASH.COLL
*   **Routine Action:** Synchronizes active guarantees with their underlying AA/MM deposits.
*   **Conditions:** Guarantees that have an attached MM (`APPLICATION.ID`) and where `VAL.EVAL.INT > 0`.
*   **Updates / Sync Triggers:**
    *   **Rollovers:** `MATURITY.DATE = NEW.DATE`
    *   **Capitalization:** `AMOUNT = NEW.AMOUNT`
    *   **Rate Changes:** `INTEREST.RATE = NEW.RATE`
*   **WARNING - LIQUIDATION OVERRIDE:** Do NOT liquidate active collateral. Do NOT set `WORKING.BALANCE = 0`.
*   **Matrix Rule:** Testing must explicitly duplicate execution across all 3 sync triggers across all 3 customer segments (PF, PJ, PRE), resulting in a minimum 15-execution matrix including bypass flows.

## WF-8171 - Liquidation restriction for collateral deposits
*   **Routine Action:** A real-time UI restriction (Override) preventing manual liquidation of deposits guaranteeing an active loan.
*   **Conditions:** The user attempts a PAYOFF or CLOSE activity on an AA collateral deposit that is actively guaranteeing a loan (associated via collateral code 100).
*   **Updates / Sync Triggers:** Throws a Supervisor Override error preventing immediate liquidation.
*   **Matrix Rule:** Negative Flow means the deposit does NOT guarantee a loan, so the transaction is allowed. Edge Case means testing the Supervisor Override mechanism.


## WF-7805 - Plan Documentare
Actiune
Detalii actiune
Efort
documentare
(h)
Dependente
alte resurse
Status Start date
Due date
Intelegere AS
IS depozite
colaterale cu
plata dobanzii
la scadenta
testare fluxuri,
documentatii confluence,
documentatii ba
6
PO
Done 15.12.2025 17.12.2025
Definire
nevoie
definire TO BE
3
PO
To do 17.12.2025 19.12.2025
GAP analysis
mapare TO BE cu
dezvoltari existente in AA
(depozite
standard)  documentatie
existenta AA etstare AA
10
BA depozite
standard
Done 16.12.2025 18.12.2025
Structurare
Depozite
colaterale PF si
PJ
Creare produs
3

To
do
18.12.2025 19.12.2025
Creare depozit  campuri input  + funding
depozit
4

To
do
19.12.2025 23.12.2025
Retragere
partiala

2

To
do
19.12.2025 23.12.2025
Lichidare

2

To
do
19.12.2025 23.12.2025
Lichidare
inainte de
termen

1

To
do
8.01.2026 9.01.2026
Plata la
maturitate

1

To
do
8.01.2026 9.01.2026
Capitalizare

1

To
do
8.01.2026 9.01.2026
Reinnoire
automata

3

To
do
8.01.2026 9.01.2026
Data platii
ajustare in functie de data
conventiei
2

To
do
8.01.2026 9.01.2026
Categorii

1

To
do
8.01.2026 9.01.2026
Conditii
contabile
Alocare in functie de
categorie
3
Contabilitate,
PO
To
do
12.01.2026 14.01.2026
Configurare
dobanda

4

To
do
12.01.2026 14.01.2026
Conversie din
depozite
standard cu
plata dobanzii
la scadenta in
depozite
colaterale
si vice-versa + mapare,
activitate noua in AA, POC 10
BA negociate To
do
12.01.2026 14.01.2026
Validari tabela
Collateral T24  tabela garantii
3

To
do
15.01.2026 16.01.2026
Notificari catre
administrare
credite din
tabela
Collateral

5

To
do
15.01.2026 16.01.2026
Validare cerinte
cu PO
validari pe parcursul
analizei; impartit in 2-3
sesiuni de validare
3
PO
administrare
+ PO
operatiuni
To
do
15.01.2026 16.01.2026
Validari
depozite
standard
validari aplicabile in
general depozitelor
standard cu plata dobanzii
la scadenta aplicabile si pe
collateral ; validari de tipul
valori minime/ maxime,
existenta fonduri,
6

To
do
16.01.2026 19.01.2026
Restrictii staff
(ce presupun dezvoltari
locale)
2

To
do
16.01.2026 19.01.2026
Restrictii si
validari
specifice
collateral
(ce presupun dezvoltari
locale)
2

To
do
19.01.2026 20.01.2026
Afisare
depozite
colaterale in
IBK

6

To
do
20.01.2026 21.01.2026
Afisare
depozite
colaterale in
MBK

4

To
do
21.01.2026 22.01.2026
Afisare
depozite
colaterale  in
IBS

4

To
do
21.01.2026 23.01.2026
validare cerinte
afisare cu PO

4
PO IBK/
MBK/
Administrare
To
do
21.01.2026 23.01.2026
Accesibilitate
drepturi modul AA
depozite standard si pentru
utilizatorii administrare
credite pentru conversii de
la standard la collateral
3

To
do
19.01.2026 23.01.2026
Aviz OSI

1
Ofiter OSI
To
do
13.01.2026 14.01.2026
Aviz DPO

1
DPO, PO
To
do
8.01.2026 9.01.2026
Validare cerinte
cu PO
validari pe parcursul
analizei; impartit in 2-3
sesiuni de validare
5
PO
administrare
+ PO
operatiuni
To
do
21.01.2026 23.01.2026
Sedinte de
analiza
sedinte analiza (2-3
sesiuni)/ impartit pe
sesiune configurari/
dezvoltari locale (validari)
si afisare in sisteme externe
+ alte us-uri
6
Dev team
To
do
16.01.2026 26.01.2026
Sedinta
estimare

3
dev team
To
do
20.01.2026 26.01.2026
Modificari
posibile dupa

6

To
do
20.01.2026 27.01.2026
sedinta de
analiza
Buffer (alte
posibile task-uri
identificate)

6

To
do
26.01.2026 27.01.2026

Mentiuni:
Concediu 24.12.2025-08.01.2026
invoiri 4 h -  19.12.2025 si 23.12.2026

## WF-7849 - Structuring PF and PJ Deposit Collateral Products
•
User story:
As a product configurator,
I want to create three distinct product groups under the Deposits product line—PF Deposits and PJ
Deposits—Professional, Retirees and Employee's Deposits.
So that each group can have a structured parent-child product hierarchy with unique term configurations.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
Product Group Creation
Create three product groups under the Deposits product line:
•
PF Deposits
•
PJ Deposits
•
Professional, Retirees and Employee's Deposits.
Parent Product Setup
Each product group should contain a parent product.
The parent product must:
•
Include its own product conditions.
Each product group is going to have 2 children, one for each category type and also a similar product for
each of them, for the negotiated version of it :
•
21032 - Non-cash pledged collateral for guarantee instruments (non cash/ scrisori de garantie)
•
21037-  Cash-secured collateral deposit for loan facilities (cash collateral)
Product
Description
Group
Mention
s
PF.COLLATERALDEPOSIT.CASH
PF depozit
colateral
credite
PF.DEPOSITS
current
category
21037
PF.COLLATERALDEPOSIT.NONCASH
PF depozit
colateral
SGB/Acrediti
v
PF.DEPOSITS
current
category
21032
Professionals.COLLATERALDEPOSIT.CASH
Professionals,
pensionari si
staff depozit
Professionals.DEPOSI
TS
current
category
21037
colateral
credite
Professionals.COLLATERALDEPOSIT.NONCASH
Professionals,
pensionari si
staff depozit
colateral
SGB/Acrediti
v
Professionals.DEPOSI
TS
current
category
21032
PJ.COLLATERALDEPOSIT.CASH
PJ depozit
colateral
credite
PJ.DEPOSITS
current
category
21037
PJ.COLLATERALDEPOSIT.NONCASH
PJ depozit
colateral
SGB/Acrediti
v
PJ.DEPOSITS
current
category
21032
PF.COLLATERALDEPOSIT.CASH.NEG
PF depozit
colateral
credite
PF.DEPOSITS
current
category
21037,
negotiate
d
PF.COLLATERALDEPOSIT.NONCASH.NEG
PF depozit
colateral
SGB/Acrediti
v
PF.DEPOSITS
current
category
21032,
negotiate
d
Professionals.COLLATERALDEPOSIT.CASH.NEG
Professionals,
pensionari si
staff depozit
colateral
credite
Professionals.DEPOSI
TS
current
category
21037 ,
negotiate
d
Professionals.COLLATERALDEPOSIT.NONCASH.N
EG
Professionals,
pensionari si
staff depozit
colateral
SGB/Acrediti
v
Professionals.DEPOSI
TS
current
category
21032,
negotiate
d
PJ.COLLATERALDEPOSIT.CASH.NEG
PJ depozit
colateral
credite
PJ.DEPOSITS
current
category
21037,
negotiate
d
PJ.COLLATERALDEPOSIT.NONCASH.NEG
PJ depozit
colateral
SGB/Acrediti
v
PJ.DEPOSITS
current
category
21032,
negotiate
d


Note: The products will be available in multiple currencies. The details of the currencies in which the
products will be available has been mentioned in the document attached along with this US. The rates
mentioned in the document will be allocated, considering the tenor, for standard collateral deposits (non-
negotiated).
Validation
•
Ensure child products are correctly linked to their parent.
•
Confirm that term uniqueness is enforced across child products.
•
Validate that no term amount is present in parent products.

Print screens of the product creation flow in T24:
Product line screenshot:

Below mentioned is the screenshot of the Deposits product line which will be used for creating product
groups for PF and PF Deposits.

Deposits product group like one mentioned below is to be created for PF Deposits and PJ Deposits.

Parent products for PF Deposits and PJ Deposits should be created similar to one shown below.


Create multiple child products with varying terms for the parent PF Deposits and PJ Deposits, as illustrated
below.

## WF-7856 - Enhance Deposit Management Process with Payment and Payout Rule Properties
•
User story: As a product manager,
I want to enhance the deposit management process by implementing payment and payout rule properties
So that deposits can be created, funded, and liquidated in a controlled and rule-based manner.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS:
•
The following actions can be performed on deposits: creation, liquidation
•
Also, increase and decrease of the principal can be performed.
•
All the actions can be done only in T24.
TO BE:
•
For creating and funding a deposit, a payment rule property is to be created and the same is to be
attached to the deposit product group.
•
The product condition for payment rule property is to be created and attached to the parent deposit
products (PF and PJ Deposits) and the products must be proofed and published.
•
This will ensure that the deposit can be funded during the deposit creation from the settlement
account.

•
For withdrawal of the Deposit (Liquidation), separate payout rule properties must be created and
attached to the Deposit product group.
•
Separate properties must be created for the following purposes (Preclose, current and unallocated).
•
Payout rule product conditions have to be created and the same has to be mapped against the payout
rule properties in the parent product and they have to be proofed and published.
•
The activity mapping product condition has to be updated with the an apply payment activity for the
each of payout rule created and mapped against the deposit product. This will ensure that the deposit
the deposit can be liquidated as well.
Increase
The operation may be performed by a loan administrator user(group 255) or  by a superior user (group 256
supervisor, group 327 back office, group 286 director & head of department) . The operation must be
authorized by a superior user (group 256 supervisor, group 327 back office, group 286 director & head of
department)
When increasing the principal, money come from the drawdown account and go intro the principal of the
deposit.
The interest should be recalculated from that moment on, taking into consideration the current value. So at
the maturity the interest paid to the client (if any change doesn't happen) should be compound by the interest
accrued until the moment of the increase for the prior principal + the interest accrued for the new principal
after the increase, for the remaining period of time.
Decrease
The operation may be performed by a loan administrator user (group 255) or  by a superior user (group 256
supervisor, group 327 back office, group 286 director & head of department) . The operation must be
authorized by one superior user. (group 256 supervisor, group 327 back office, group 286 director & head of
department)
The interest should be recalculated. The core functionality for this option should be applied.
The money  withdrawn should be transfered into the settlement account.

Acceptance Criteria:
•
Deposit Creation
1. The user is able to successfully create a deposit.
2. The deposit is initialized with a commitment amount.
•
Funding the Deposit
1. The user can fund the deposit up to the full extent of the commitment amount.
2. The system updated the Deposit status as “Current”.
•
Early Liquidation
1. The user can liquidate the deposit before its maturity date.
2. The system processes the liquidation and updates the deposit status as “Closed”.
Print screens for the configuration to be implemented in T24:
Payout rules properties to be created as shown below.

Activity mapping to be configured with the apply payment activity as shown below.

## WF-7904 - Configure Collateral Deposit Product with Payment at Maturity, Renewal, and Capitalization
•
User Story: As a Product Configuration Analyst, I want to configure a collateral deposit product that
supports payment at maturity, automatic renewal, and interest capitalization,
So that customers can receive interest payments at maturity and have their deposits automatically
renewed with capitalized interest.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
Acceptance Criteria:
•
The collateral deposit product should have a payment schedule configured to pay interest at maturity
(e.g., 12 months).
•
A change product product condition should be created to enable automatic renewal of the deposit
arrangement.
•
Interest earned can be capitalized and added to the principal amount upon renewal.
•
Interest earned can be paid out to settlement account and the principal amount can alone be carried
forward during the renewal of the deposit.
•
Core configuration should include:
o Payment schedule product condition setup for interest payment at maturity.
o Change product product condition setup for automatic?? renewal and capitalization.
•
The configuration should be tested to ensure correct interest calculation and renewal behaviour.
If any changes occur regarding the interest during the lifetime of the collateral deposit the interest should be
calculated as:
Technical Notes:
•
Configure the payment schedule product condition to trigger interest payment at the end of the term
(12M).
•
Define a change product product condition that activates upon maturity to renew the deposit.
Print Screens for the configuration in T24:
The change product product condition like the one mentioned below should be created and attached to
change product property in the Collateral Deposit products (PF and PJ Deposits).

Principal Rollover can be done in a number of ways:
•
Specify an amount to be credited to the PAY<Account> on the Renewal date. This can be either an
increase in the principal amount or a decrease. A bill will be produced either as an expected receipt
or payment
•
Specify an amount to MAINTAIN in the Payment Schedule on the Renewal date. If the amount
specified is lower or higher than the current balance, then a bill will be produced either as an
expected receipt or payment.

To use the MAINTAIN option in payment schedule, the below AA.PAYMENT.TYPE record will need to be
established.

## WF-7911 - Payment Date Adjustment Based on DATE.CONVENTION
•
User Story: As a payment processing system, I want to adjust the payment date using the
DATE.CONVENTION>>AA.PRD.DES.ACCOUNT field, So that payments are moved to the next or
previous working day depending on whether the adjustment stays within the same month or crosses into
the next.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
Acceptance Criteria:
Same Month Adjustment:
•
If the calculated payment date falls on a non-working day (e.g., weekend or holiday),
•
And the next working day is still within the same calendar month,
•
Then the payment date should be moved forward to the next working day.
Cross-Month Adjustment:
•
If the calculated payment date falls on a non-working day,
•
And the next working day falls in the next calendar month,
•
Then the payment date should be moved backward to the previous working day within the same
month.
Working Day Definition:
•
Working days are defined by the system’s calendar configuration (excluding weekends and holidays).
•
This is to be done via holiday table set for RON for all the currencies in T24.
Validation:
•
The system must validate that the final payment date is a working day and within the correct month
boundary.
Note:
•
The details of how this is to be implemented in T24 is available in the print screen below
Print screens in T24 to implement the above-mentioned configurations:
The below mentioned configurations are to be made against the account product condition and the same is to
be attached against the parent deposit products (PF and PJ Deposits).

## WF-7918 - Category to be used for Collateral Deposits (AA Deposits)
•
User Story: As a Product Manager I want To transition the term deposit creation process from the MM
module using category "21032 (non cash)
21037 (cash collateral) to the AA module So that
We can implement three new products for PF Deposits and PJ Deposits and Professional, Retirees and
Employee's Deposits, using a new category for deposit creation.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS:
currently, the category used for creating the collateral deposits using the MM module is the following
•
21032 - Non-cash pledged collateral for guarantee instruments (non cash/ scrisori de garantie)
•
21037-  Cash-secured collateral deposit for loan facilities (cash collateral)
TO BE:
As a part of our AA implementation, we will creating three new products (one for PF Deposits and the other
for PJ Deposits and one for Professional, Retirees and Employee's Deposits) for each category so in total 6
new products and a new category will be used for creating deposits product using the AA module.
Acceptance Criteria:
Three new deposit products (PF, PJ and Professional, Retirees and Employee's Deposits) are successfully
created in the AA module. Taking into consideration that in T24 we have the collateral deposits
structured on 2 categories (21032- SGB and 21037-cash), we should have 2 products for each group, so
in total 6 new products
Existing MM module category "21032 and 21037 " are going to be used for new deposit creation. They are
mapped with the specific products.
Documentation is updated to reflect the new process and category usage.
The below mentioned is the screenshot of the account product condition
in AA.PRD.DES.ACCOUNT which is the table used for configuring the category of the account.

## WF-7925 - Configure Interest Property for Collateral Deposit ProductsConfigure Interest Property for
Collateral Deposit Products
•
User Story: As a product configurator, I want to create and attach an interest property to deposit products
along with the product condition, So that interest can be accrued daily and either paid out monthly or
capitalized based on the payment schedule configuration.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS
Interest handling for deposits varies by product configuration:
For some deposits, interest is paid out at maturity, meaning no interim payments are made.
In certain cases, the interest is capitalized, meaning it is added to the principal amount and the deposit is
rolled over, increasing the base for future interest calculations.
TO BE
A dedicated interest property is created and attached to the deposit product, along with the relevant product
condition. The interest property is configured within the payment schedule, enabling daily accrual of interest
for accurate and timely calculations.
Flexible payout options:
•
Interest payout during maturity of the deposit.
•
Capitalization of interest into the principal balance.
The above-mentioned option should be selected by the user during the deposit creation and hence they will
be kept as negotiable fields at the product level.
Acceptance Criteria:
• Interest property is created and linked to the relevant deposit product and its condition.
• Payment schedule is configured to accrue interest on a daily basis.
• Interest payout options are supported:
• Interest payout during maturity to the interest liquidation account.
• Capitalization to the principal balance of the deposit.
Print Screen of T24 configurations:
An interest property interest is to be created and the same is to be attached to the product group similar to
the one mentioned below.

The interest product condition is to be created similar to the one mentioned below and the same is attached
against the property in the Deposit products.

The calculation source is to be given to the credit interest property which will act as a source balance for the
interest accrual as shown below.

The payment schedule product condition needs to be configured for the interest accrual to happen on a daily
basis and also decide as to whether the interest amount has to be paid out to the settlement account or the
interest amount must be capitalised to the principal balance of the Deposit account. Also, if the interest is to
be paid out to the settlement account or capitalised to the principal balance of the Deposit account monthly,
the same is to be configured in payment schedule as well similar to the ones shown below.



The interest day basis is to be configured as E in the interest product condition AA.PRD.DES.INTEREST
similar to the one shown below.

## WF-7932 - Accounting conditions for Collateral Deposits
•
User Story: As a product owner, I want the accounting system to apply allocation rules based on Property
Class or a combination of Property and Property Class, so that accounting events are triggered consistently
and accurately across all financial products.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
•
The Accounting Property Class is used by all financial products, and this controls the link between the
accounting events generated by the property actions and the accounting allocation rules to be applied
to these events.
•
Accounting rules can be defined either based on Property, Property Class or combination of them. If it
is defined based on Property Class, then for all instances of the Property Class the same action and
allocations are triggered. If accounting is defined based on Property Class and Property, then Property
takes precedence.

## WF-7939 - Liquidation prior to the maturity date
•
User Story: As a user, I want to have the credit interest waived off when the deposit is liquidated so the
interest is paid out to the customer in case of liquidation of AA Collateral Deposit.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat:
Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS
Currently when the MM Collateral Deposit is liquidated prior to the maturity date, then the credit interest is
paid out to the settlement account of the customer.
TO BE
The same functionality is to be extended to AA Deposits as well.
If a collateral deposit is liquidated prior to its maturity date, the accrued interest, for the time passed is going
to be paid out to the settlement account of the customer at the moment of the liquidation.

## WF-7955 - Conversion of Term Deposit to Collateral Deposit
•
User Story: As a Product Builder, I want to create configurations, so that the user can convert the term
deposits to Collateral Deposits.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS
Converting a Standard Term Deposit into a Collateral Deposit
This workflow is used when the customer already holds an existing term deposit and wishes to pledge it as
collateral for a loan, without creating a new deposit. In this scenario, the existing deposit is converted into a
collateral deposit by updating its category.
When this conversion is used
•
The customer already has a Time Deposit and wants to use it as loan collateral
•
The deposit only needs to be converted (not newly created)
•
The category is changed from Time Deposit → Collateral
Main Steps
•
Open the version Transform Term Deposit to Collateral
•
Modify only the category (to 21032/21037)
•
Interest rate, maturity date, and tenor remain unchanged
•
Validate and authorize the operation
The reverse action is also possible, converting a collateral deposit into a standard one.
TO BE
A new activity is going to be added for the term deposits (PF and PJ) > conversion of the term deposits into
collateral deposits.
The user is going to select "New activity" from the term deposit screen and then "Change product
arrangement"



After, the user is going to be able to select the product he is changing the arrangement to


Example from the POC for negotiated
When clicking on the dropdown arrow from the product list a list of eligible products to we can covert given
the product that we have and the role we are logged with is going to appear. The list is going to be field based
on the tenor of the current
The list of the products in the list eligible for conversions to be done by credit administration user, for each
kind of existing term deposits
•
Term deposits PF (any of the products under this group) > Collateral PF (all the products under this
group with the same tenor as the initial product)
•
Term deposit PJ (any of the products under this group) > Collateral PJ(all the products under this group
with the same tenor as the initial product)
•
Term deposit Individuals > Collateral Individuals (all the products under this group with the same tenor
as the initial product)
•
Negotiated deposit PF > Negotiated Collateral PF (cash and non-cash), with the same conditions, same
tenor and interest.
•
Negotiated deposit PJ > Negotiated Collateral PJ (cash and non-cash), with the same conditions, same
tenor and interest.
•
Negotiated deposit Individuals > Negotiated Collateral Individuals (cash and non-cash), with the same
conditions, same tenor and interest.
for example from a term deposit PJ 3M, the corresponding list should include all PJ collateral products with
the field tenor pre completed with 3M (cash and non-cash, only for non-negotiable)
Possible conversions:
•
standard
->
collateral
non
negotiated
cash
standard
->
collateral
non
negotiated
non
cash
negotiated
->
collateral
negotiated
cash
negotiated -> collateral negotiated non cash
All conversions should be accessible from a common version.
After clicking validate, the following information can be modified:
•
the field "Auto rollover and capitalization" - the field is going to be pre-completed with the initial
value, but it is going to be editable, in order to be changed.
•
Interest - autocompleted with the standard interest configured for the term deposits with the same
tenor. For the standard collateral deposits the user isn't going to be able to change the pre-completed
interest.

The change from a standard collateral deposit to a negotiated collateral  (which may be needed at the rollover
but when the client wants to negotiate the interest, very little cases, but may happen), isn't going to be possible
by this action. The case is going to be treated manually by the loan administrators (firs a new collateral deposit
is going to be created and then the initial one is going to be liquidated, and the interest to be paid to the client
by a specific requirement to the operations team by a ticket; the cases are limited) .
Accesibility: Only users with credit administration roles (group 255, 256, 327, 286 in T24) are going to be
eligible for converting term deposits to collateral deposits.

When changing the product arrangement to a collateral product the following fields are going to change:
•
category
•
also, we are going to see in the section "All activities" the change that have been made.
The operation must have an authorization step in the process. The user that is going to be eligible for
authorizing a change from term deposit to standard deposit is going to have credit administration supervisor
role (256 group in T24), back office (327) and Director (286).
Note:
In the comments section you can find  POC attatched  for the example of conversion from term deposits to
negociated. We need to have the functionality for the conversion  to collateral similar to the POC.
When converting the product (for example from a term deposit to a collateral one), the accrued interest is
going to be paid to the client into the interest liquidation account at the maturity date.

## WF-8122 - Minimum amount required for creation of  Collateral Deposit
•
User Story: As a user, I want to have a validation in place to check whether minimum commitment amount
for creation of deposit is 100 (Any currency) so that the system would not allow creation of deposit for
commitment amount less than 100 (Any currency).
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS functionality:
•
Currently in the MM Deposits, a minimum of 100 (of any currency) is required as a commitment
amount for deposit creation. If the commitment amount is less than 100, an error is raised.
TO BE functionality:
The above-mentioned functionality is to be extended for the AA Deposits. In order to cater to this requirement,
an activity API is to be developed whose details have been mentioned below.
•
The activity API is to be attached against the following activity "DEPOSITS-NEW-
ARRANGEMENT". (same as for the standard deposits? )
•
The routine should check the value in the AMOUNT field in TERM.AMOUNT property of the
Arrangement and should check if the value is greater than or equal to 100. If yes, no error is to be
raised. If the condition is not met, an error is to be raised.
Note:
The above-mentioned functionality is applicable for RON, EUR, USD deposits.

## WF-8129 - Restriction on staff deposit accounts
•
User Story: As a user, I need employee collateral deposit accounts to have restrictions, and only certain
user groups should have viewing, input, and authorization rights
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
To obtain this functionality for deposits, the local development implemented on the AA savings accounts can
be used ( [https://jira.libra.bank/browse/WF-536 ).
TO BE:
When a USER without sufficient privileges tries to input, authorize and view Deposit arrangement specific
records, they will not be allowed to do so.
When a USER with sufficient privileges tries to input, authorize and view Deposit arrangement specific
records, they should be allowed to do so.
For AA.ARRANGEMENT.ACTIVITY application a record is created in RE.RESTRICTII.CONT.ANGAJAT
table., where the list of users with rights to input, view and authorize should be configured. (including target
51).
Using version control routine LBK.RESTRICT.CONT.ANGAJAT, access will be ensured for users with
privileges.
Input: credit administration users (group 255 in T24), credit administration supervisor ( 256 group),
backoffice( 327 group) and director and head of departments (286 group)
View: credit administration users (group 255 in T24), credit administration supervisor ( 256 group),
backoffice( 327 group) and director and head of departments (286 group)
Authorize: credit administration supervisor ( 256 group), backoffice( 327 group) and director and head of
departments (286 group)

## WF-8136 - Restrictions for overdue amounts Applicable to Collateral Deposits (Same as Standard Deposits)
•
User Story: As a Credit Administration I need the same set of standard restriction rules regarding overdue
amounts applied to Collateral Deposits as currently applied to Term (Standard) Deposits so that the system
consistently enforces deposit-related limitations and prevents unauthorized or incorrect operations on
collateral deposits.
•
Aplicatii influentate:  T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
Overdue amounts – impact on deposit creation – If a customer with a PD can create a deposit or not
AS IS
Currently, when a customer has an active PD and for that customer if we try to open an MM Deposit, an error
is raised preventing the deposit to be opened for that customer. The functionality has been extended for the
term deposits as well through an activity API.
TO BE
The same functionality needs to be extended to the AA Collateral Deposits as well.
Activity API:
•
The activity API is to be attached against the following activity "DEPOSITS-NEW-
ARRANGEMENT".
•
The routine should check whether the customer has an active PD. This can be checked from
PD.CUSTOMER
for
the
customer
for
whom
the
deposit
arrangement
is
opened.
The routine should verify the status of all the record for the customer in the PD.CUSTOMER and
check whether the STATUS is not equal to "CUR". If there is at least one record for the customer in
PD.CUSTOMER where the status is not equal to "CUR", then an error is to be raised while trying to
create a deposit arrangement for the customer.
•
Else, creation of the deposit arrangement can be allowed for that customer.
The print screens for PD.CUSTOMER and the underlying PD records have been mentioned below.

## WF-8143 - Defaulting of Drawdown account and Principal and Interest liquidation account
•
User story: As a user, I want to default the settlement account in case of settlement account is not specified
during arrangement creation so that the same can used for funding the deposit (payin account) and
liquidating deposit (payout account).
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS:
Defaulting
of
Drawdown
account
and
Principal
and
Interest
liquidation
account:
The user can choose the account from which to set up the deposit, otherwise the system will default to the
client’s first account in the deposit currency, but without any eligibility validation of the account.
TO BE:
As a part of this development, a routine is to be created and the same is to be attached against the new
arrangement activity “DEPOSITS-NEW-ARRANGEMENT”.
The details of the functionality of the routine have been mentioned below.
•
In case of settlement account not being specified in PAYIN.ACCOUNT and PAYOUT.ACCOUNT
against the settlement property during the new arrangement creation, the core workflow should work
based on the settlement account specified.
•
In case of no settlement account being specified in PAYIN.ACCOUNT AND PAYOUT.ACCOUNT
against the settlement property during new arrangement creation, then client’s first account in deposit
currency is to be defaulted as the settlement account (PAYIN.ACCOUNT and PAYOUT.ACCOUNT).
The first account of the client in deposit currency can be identified by referring the following table
“CUSTOMER.CCY.ACCT”.

## WF-8150 - Defaulting of Account officer during the deposit creation
•
User story: As a user, I want to have the account officer defaulted from the customer record during deposit
arrangement created so that the system uses the most relevant officer information.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS
IS:
Defaulting of MIS.ACCOUT.OFFICER after choosing tenor during creation of MM record.
This is filled by default with the ACCOUNT.OFFICER from CUSTOMER.

TO BE:
The PRIMARY.OFFICER field in the OFFICERS property of the arrangement is used to capture the account
officer during the deposit arrangement creation process.
•
If a value is specified, the same is considered as an account officer for the deposit arrangement. The
value entered in the field PRIMARY.OFFICER field should be valid record in the
DEPT.ACCT.OFFICER table in T24.
•
If the value is not specified against the PRIMARY.OFFICER in the OFFICERS property of the deposit
arrangement, then the account officer from the CUSTOMER record is defaulted for the deposit
arrangement.
Note:
The PRIMARY.OFFICER field can be hidden in the version used for OFFICERS property, so that the bank
users cannot input the officer field and account officer from the customer record is defaulted during the
arrangement creation.

## WF-8157 - Posting restriction on customer, account and ACLK on account- AA collateral deposits (Same
as for term deposits)
•
User story: As a user, I need that for a customer with ACLK, a certain PR set on customer or on account,
a blocking override is raised which requires operations authorization
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS:
For term deposits PR on customer:
Deposit creation will be allowed for customers with PR=1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 80, 90. For those PRs
there is still an override shown, but transforms into free and there is no need for auth.
If there is a PR=10 on customer, you will get an override that requires auth from DDO user.

PR on account:
Creation is only allowed from accounts with PR=6 (CREDIT) – an override is still shown, but it is transformed
into a free override and no authorization is required.
For other PRs present on the account from which the deposit is created, an override is triggered that requires
acceptance and authorization by a user with DDO rights.
If you try to liquidate a deposit, it is allowed from an account with any PR.
ACLK:
If a client has an overdue payment, a blocking override is triggered.
ACLK: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22.
A deposit can be created with an amount less than or equal to the available balance.
If there is a garnishment/ACLK on the account and the deposit amount exceeds the available balance, but still
falls within the total balance, an override will be triggered that requires authorization from a user with DDO
rights. This action would result in the account being overdrawn, so it will not be authorized—only rejected

The functionality was adjusted and applied to the AA term deposits as well as a routine attached to
DEPOSITS-NEW-ARRANGEMENT activity the following way:
PR on customer:
In this regard, the existing routine for term savings account events can be used to check whether the customer
of the arrangement has POSTING.RESTRICT=1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 80, 90. at CUSTOMER level.
If yes, an override is to be raised and requires authorization from operations support department and the
creation is allowed with a FREE override for PR=6, which is credit. Basically for all PR on debit and total the
system must raise an INAO.
PR on account:
In case of creation, the routine should check whether the account has any posting restriction. Creation is only
allowed from accounts with PR=6 (CREDIT). It should behave exactly like the version noted above on
customer.
For other PRs on the account from which the deposit is created, an override is triggered that requires
authorization from operations support department.
If you try to liquidate a deposit, it is allowed from an account with any PR.
ACLK:
The routine should check if a client has an overdue payment. If yes, a blocking override is triggered.
For any ACLK, you can create the deposit only with an amount less than or equal to the available balance. If
you try to open with an amount that exceeds the available balance but still falls within the total balance, it will
trigger an override that required authorization from operations support department.
PR = 10 on customer should have a blocking override. All other PRs on customer should not require auth,
even there is an override shown (Free).
Also the new PR = 14 which is for PJ customers should be treated as PR = 10.

For collateral deposits all of them need authorizations, which are made by credit administration
supervisors.

TO BE
1. Verifications regarding Posting restrict on customer
POSTING.RESTRICT=1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 80, 90. at CUSTOMER level.
If yes, an override is to be raised and requires authorization from credit administration supervisor.

2. Verifications regarding Posting restrict on account
In case of creation, the routine should check whether the account has any posting restriction.
For other PRs on the account from which the deposit is created, an override is triggered that requires
authorization. The authorization can be made by a credit administration supervisor.

3. ACLK
The routine should check if a client has an overdue payment.
If yes, a override is triggered.
For any ACLK, you can create the deposit only with an amount less than or equal to the available balance. If
you try to open with an amount that exceeds the available balance but still falls within the total balance, it will
trigger an override that required authorization. The authorization must be done by a credit
administration supervisor.
The user that is going to be eligible for authorizing a change from term deposit to standard deposit is going
to have credit administration supervisor role (256 group in T24), back office (327) and Director (286).

## WF-8164 - Synchronizations (Same as term deposits)
•
User story: As a user, I need that when the account officer or the name on the customer is changed, to be
also updated on the deposit products.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
Same logic implemented for saving account and term deposits should apply to the collateral deposits as well:
1. Sychronization of account officer
Post modification of the account officer field on CUSTOMER and authorizing it, the existing local batch job
should update the same value in PRIMARY.OFFICER field in AA.ARR.OFFICERS for all arrangement
products belonging to this customer.
To
identify
the
arrangement
belonging
to
this
customer,
the
following
table
AA.CUSTOMER.ARRANGEMENT can be refered to.
In addition to the modification to be made in the existing local batch job, a validation routine is to be created
and attached to the new arrangement creation version.
At the time of new creation, upon validation the account officer is to be defaulted from the customer record
for the customer of the arrangement.
For this functionality to work, a property for officers property class should be created and the same is to be
attached to the Deposit and all the products should be proofed and published.
Also, the PRIMARY.OFFICER field should be kept negotiable at the arrangement level so that the same field
could be updated via the auth routine.
2.  Sychronization of account short title
When the changes are made on the fields mentioned below on customer records, changes must be made in the
corresponding account record.
CUSTOMER application
ACCOUNT application
NAME.1>>CUSTOMER
ACCOUNT.TITLE.1>>AA.ARR.ACCOUNT
NAME.2>>CUSTOMER
ACCOUNT.TITLE.2>>AA.ARR.ACCOUNT
SHORT.NAME>>CUSTOMER SHORT.TITLE>>AA.ARR.ACCOUNT
To make modifications in AA.ARR.ACCOUNT table, it is possible only via triggering activities against the
AA Arrangement.
For making changes against the account property of the arrangement, the following activity is to be used
“ ACCOUNTS-UPDATE-BALANCE".

Note:
Since these functionalities are intended to operate identically for collateral deposits, a dedicated round of
testing is required to confirm that all synchronizations and behaviours are also correctly triggered for
collateral deposits.
This validation step is needed to ensure functional alignment between the two deposit types and to confirm
that no dependency or rule implemented earlier is limited only to standard deposits.

## WF-8196 - Impact in existing enquiries
•
User story: As a credit administration user I need the existing enquiries to be updated in order to return
collateral deposits from AA, as well.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS
In T24 we currently have the following enquiries:
Section
Enquiry
Description
Client Deposits ENQ MM.CONTRACT.LIST
Displays the list of a client’s deposits, both term
deposits and collateral deposits.
Customer
Position
ENQ
LBK.CUSTOMER.POSITION
Displays the list of the client’s products, including
cash-collateral deposits.
Deposit
Exceptions
ENQ
MM.NAU.CREDITE
NONE
Displays the list of unauthorized deposits.
Client Deposits

Customer position

Deposit exceptions can be accesed from T24> Exceptii Depozite


TO BE
The T24 enq should be modified in order to include the AA collateral deposits as well.
1. ENQ MM.CONTRACT.LIST - should return the AA deposits as well, including the AA collateral
deposits and AA term deposits
2. ENQ LBK.CUSTOMER.POSITION - should include into the calculation also the AA collateral
deposits and the accrued interest from them.
3. ENQ MM.NAU.CREDITE NONE - should include also the unauthorized AA collateral
deposits with options to See, Edit, Authorise, Delete also collateral deposits from AA; In the Version
field, for AA collateral deposits, the name of the deposit is going to be completed.

## WF-8203 - Creating a collateral deposit
•
User story: As a Credit Administration user, I need to create a collateral deposit in the AA module
So that it can be linked as collateral to a loan and follow all required business rules.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS
Currently in T24, when creating a collateral deposit the credit administration user should complete the
following fields:

TO BE
The credit administration users should be able to create collateral deposits in AA, not only converting from
term deposits into them.
Fields that should be completed by the user when opening the collateral deposit:
•
Product type (Selecting it from one of the 12 available products) > Depending the client type, the list
displayed is going to have the specific products (for example if the client is a PJ > the list is going to
have
4
available
products
>
PJ.COLLATERALDEPOSIT.CASH,
PJ.COLLATERALDEPOSIT.NONCASH,
PJ.COLLATERALDEPOSIT.CASH.NEG
and
PJ.COLLATERALDEPOSIT.NONCASH.NEG)
•
Currency - dropdown list; a restriction should be implemented for the user to be able to select only the
currencies the client have accounts opened.
•
Tenor -drop downlist with the folllowing options: 1w, 1m, 3m, 6m, 7m,9m,12m, 24m, 36m
•
Interest - autocompleted with the standard interest configured for the term deposits with the same tenor.
For the standard products the user isn't going to be able to change the pre-completed interest.
For the negotiated collateral products the administration user is going to add manually the interest in the
dedicated field.
•
Auto rollover- Yes/ No/None  - pre completed with "none", a value from "Yes" and "No" should be
selected, otherwise an error message should arise.
When selecting "Yes" -Automatic renewal is enabled and at the maturity the deposit is going to be renewed
for the same period.
nice to have:
•
Interest capitalization- Yes/No/None - pre completed with "none", a value from "Yes" and "No" should
be selected, otherwise an error message should arise.
Note: the same functionality as per term deposit should be used for Auto rollover and interest capitalization,
so they will be found in the same field with the possible options:
•
No auto rollover, no capitalization
•
With auto rollover, no capitalization
•
No auto rollover, with capitalization
•
With auto rollover, with capitalization
The option "With auto rollover, no capitalization" should be preselected for collateral deposits.
•
Starting date- pre-completed with the current date, but can be edited.
•
Maturity date- auto completed taking into consideration the starting date and the tenor, the field isn't
going to be visible in the user interface
•
Amount - numeric - if the completed value is more than the balance from the accounts, an error is
returned.
•
Drawdown account- list of the clients accounts > only the accounts in the selected currency should be
included in the list
•
Liquidation account - after selecting the drawdown account this field is going to be pre-completed with
the same value, but can be modified with another value from the eligible client accounts (for that
currency)>  only the accounts in the selected currency should be included in the list
•
Interest liquidation account -after selecting the drawdown account this field is going to be pre-
completed with the same value, but can be modified with another value from the eligible client
accounts (for that currency)>  only the accounts in the selected currency should be included in the list
An authorization step should be included after the creation of the deposit. The authorization can be made by
a credit administration supervisor.

When creating a staff collateral deposit, the amount available in the selected accounts shouldn't be seen by the
user.
In order to be sure that we don't create collateral deposits with a principal that is more than the available
amount for staff an override that should be converted to an error should be raised.
Mention for testing:  the tests should be performed for both staff (target 51) and non-staff client.

## WF-8211 - Validations for APLICATION.ID in guarantees
•
User story: As a credit administration user I need the APPLICATION.ID field from guarantees to be able
to be filled with the AA collateral deposit ID and keep the same validations in order to show the correct
total assesed value.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS:
APLICATION.ID (Cod/cont depozit colateral)  is the field where the cash-collateral deposit ID is
entered on guarantees.
Versions through which it can be completed/modified:
•
COLLATERAL,INPUT.LBKO
•
COLLATERAL,SIMPLE
When field "Tip garantie (detaliat)" - COLLATERAL.TYPE = 101, 102, 103, 107 the APPLICATION.ID is
mandatory.
APPLICATION.ID(Cod/cont depozit colateral) can be filled in with the MM ID or an account (for
collateral.type=107 (category 1072)).
On commit, the value of the deposit must be taken into the field “Valoare evaluată integrală –
VAL.EVAL.INT”.
Regardless of what value is manually entered in the “Valoare evaluată integrală – VAL.EVAL.INT” field, the
system must take the deposit value.
An error message is displayed if the deposit is already attached to another guarantee ID.


Error when the value in Application.ID is not completed: core validation "INPUT MISSING".
TO BE
The AA-generated deposit must be allowed and is mandatory to be filled in the field APPLICATION.ID
(Cod/cont depozit colateral)  when the field "Tip garantie (detaliat)" = 101,102,103, 107 on the following
versions in T24:
•
COLLATERAL,INPUT.LBKO
•
COLLATERAL,SIMPLE
The same functionality as in present should be maintain on commit so:
•
After filling in the ID of the deposit,  the field   VAL.EVAL.INT is going to be auto-completed by a
routine with the value of the deposit.
Even if the user is going to change manually this value, when clicking commit, the field VAL.EVAL.INT is
going to be populated with the value of the deposit.
An error message must be displayed if the deposit (the AA ID) is already attached to another guarantee ID.
The error message should be the same as it is now: " The total for this collateral exceeds the MM".
Mention for testing: when creating the guarantee and after modifying the collateral deposit

## WF-8238 - Tax for AA collateral deposits
•
User story: As a user, I need the logic regarding tax to be adapted for the collateral deposits in the new
AA module in order to have the taxes applied correctly for these deposits as well.
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS
A tax functionality is already implemented in AA module for term deposits as described
in https://jira.libra.bank/browse/WF-6197
TO BE
The same routine should be updated in order to be applied on collateral deposits as well.
The taxes applied are the same as for term deposits.

Note for testing phase:
The taxes applicable are the following:
▪
if there is a Legal Entity Resident (PJ Resident): TAX 0%
▪
if there is a non-resident Legal Entity (PJ) with a valid tax residency certificate: TAX X% according
to the certificate (after the residence record is checked, the existence of a certificate in the system will
be verified. If it exists, the tax rate used is the one from certificate).
▪
if it is a non-resident Legal Entity (PJ) without a certificate: 16%
▪
Resident PF - 10% rate
▪
Non-resident Individual (PF) with a valid tax residency certificate: TAX X% according to the
certificate (similar to PJ)
▪
Non-resident Individual (PF) without a certificate: 16%
▪
Cyprus residents - applicable for both PF and PJ: after the residence is checked, it is looking for
certificate. If there is no certificate, the tax rate applied is 16%, if there is a certificate, the tax rate is
10%.

## WF-8250 - Distinct menu view for credit administration (Local dev)
•
User story: As a loan administration user, I need to see in the AA deposits list only the deposits that I am
allowed to create (Collateral), so that I can easily avoid errors
•
Aplicatii influentate: T24
•
Impact_rapoarte_existente: Nu
•
Documentat: Da, inclusiv drepturi de vizualizare pentru diviziile de control (daca este cazul)
Description
AS IS
The view in the AA menu gathers all the products, from all the divisions.
TO BE
•
In the AA menu, among the available products, when a loan administration user is logged in, only the
specific products (collateral deposits) that they are allowed to create should be visible.
It is acceptable for loan administration users to be able to view collateral deposits and term deposits as
well.
•
The loan administration users need to be able to view term deposits in order to be able to perform the
conversion from term to collateral.
•
Additionally, other types of users must not be able to create collateral deposits and must not be able
to view them.

Credit administration T24 groups:
255- credit administrator
256- supervisor
327- back office
286 - head of department, director

Analysis meeting 17.02 > Versions to be shown into the menu:
1. Creation
2. Conversion
3. Liquidation
4. Principal update
5. Interest update (for negotiated products)
Mention for testing: the tests should be performed for both staff and non staff clients

