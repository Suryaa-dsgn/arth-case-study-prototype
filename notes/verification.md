# Verification log

Run against the production build (`npm run build`, `npm run preview`), 2026-10-25, after the Principal PM review corrections. Commands: `npm run verify -- http://localhost:4174/` and `npm run e2e -- http://localhost:4174/`.

```
verify-data passed: 11 values, grouping, bars and 8 SLAs match Part D, in data and rendered app.
PASS  route #/ renders  [Operations 
overview · nav: Overview]
PASS  route #/ integrity strings
PASS  route #/ axe serious/critical
PASS  route #/ no red/amber status colour
PASS  route #/compliance renders  [Compliance · nav: Compliance]
PASS  route #/compliance integrity strings
PASS  route #/compliance axe serious/critical
PASS  route #/compliance no red/amber status colour
PASS  route #/financial renders  [Financial Operations · nav: Financial Operations]
PASS  route #/financial integrity strings
PASS  route #/financial axe serious/critical
PASS  route #/financial no red/amber status colour
PASS  route #/service renders  [Service Operations · nav: Service Operations]
PASS  route #/service integrity strings
PASS  route #/service axe serious/critical
PASS  route #/service no red/amber status colour
PASS  route #/client renders  [Client Experience · nav: Client Experience]
PASS  route #/client integrity strings
PASS  route #/client axe serious/critical
PASS  route #/client no red/amber status colour
PASS  drawer KPI 01 shows all fields  [116]
PASS  drawer KPI 02 shows all fields  [30]
PASS  drawer KPI 03 shows all fields  [27]
PASS  drawer KPI 04 shows all fields  [95.18%]
PASS  drawer KPI 05 shows all fields  [₹55,26,140]
PASS  drawer KPI 06 shows all fields  [₹14,36,923.85]
PASS  drawer KPI 07 shows all fields  [30.00%]
PASS  drawer KPI 08 shows all fields  [55]
PASS  drawer KPI 09 shows all fields  [₹7,61,400]
PASS  drawer KPI 10 shows all fields  [40 of 42]
PASS  drawer KPI 11 shows all fields  [16]
PASS  drawer next steps 1 to 11 in Part D order
PASS  drawer next disabled on KPI 11
PASS  queue opens drawer
PASS  back closes drawer
PASS  forward reopens drawer
PASS  Esc closes drawer
PASS  drawer close returns focus to its trigger  [<a href="#/?kpi=05" class="inline-flex items-center gap-1 te]
PASS  drawer 'Go to area' navigates
PASS  KPI 2 label on #/
PASS  KPI 2 label on #/compliance
PASS  KPI 2 label in index table
PASS  KPI 2 drawer separates 30 from 132
PASS  KPI 2 old label only as Part D reference
PASS  View KPI detail #1 opens KPI 01  [Overdue compliance obligations]
PASS  View KPI detail #2 opens KPI 05  [Rent reconciliation gap]
PASS  View KPI detail #3 opens KPI 07  [First-response SLA breach rate]
PASS  View KPI detail #4 opens KPI 10  [Open liaisoning cases with stale or missing client updates]
PASS  four proposed-action strips with approved labels
PASS  action strips are not controls
PASS  operating-area link "Open Compliance"
PASS  operating-area link "Open Financial"
PASS  operating-area link "Open Service"
PASS  operating-area link "Open Client"
PASS  queue area link "Go to Compliance"
PASS  queue area link "Go to Financial Operations"
PASS  queue area link "Go to Service Operations"
PASS  queue area link "Go to Client Experience"
PASS  sidebar "Compliance"  [Compliance]
PASS  sidebar "Financial Operations"  [Financial Operations]
PASS  sidebar "Service Operations"  [Service Operations]
PASS  sidebar "Client Experience"  [Client Experience]
PASS  sidebar "Overview"  [Operations 
overview]
PASS  first Tab reaches skip link
PASS  visible focus ring on every tab stop  [35/35 ]
PASS  How to read this opens dialog
PASS  dialog returns focus to trigger
PASS  cadence panel lists 5 forums and 8 SLAs
PASS  tooltip opens on keyboard focus
PASS  tooltip opens on hover
PASS  index shows 11 rows
PASS  filter Monthly = KPIs 4, 5, 6, 9
PASS  empty filter result shows message
PASS  route #/ links all route somewhere
PASS  route #/ no dead buttons (5)
PASS  route #/compliance links all route somewhere
PASS  route #/compliance no dead buttons (4)
PASS  route #/financial links all route somewhere
PASS  route #/financial no dead buttons (3)
PASS  route #/service links all route somewhere
PASS  route #/service no dead buttons (3)
PASS  route #/client links all route somewhere
PASS  route #/client no dead buttons (3)
PASS  1440x900 #/ layout
PASS  1440x900 #/compliance layout
PASS  1440x900 #/financial layout
PASS  1440x900 #/service layout
PASS  1440x900 #/client layout
PASS  1280x800 #/ layout
PASS  1280x800 #/compliance layout
PASS  1280x800 #/financial layout
PASS  1280x800 #/service layout
PASS  1280x800 #/client layout
PASS  1024x768 #/ layout
PASS  1024x768 #/compliance layout
PASS  1024x768 #/financial layout
PASS  1024x768 #/service layout
PASS  1024x768 #/client layout
PASS  768x1024 #/ layout
PASS  768x1024 #/compliance layout
PASS  768x1024 #/financial layout
PASS  768x1024 #/service layout
PASS  768x1024 #/client layout
PASS  390x844 #/ layout
PASS  390x844 #/compliance layout
PASS  390x844 #/financial layout
PASS  390x844 #/service layout
PASS  390x844 #/client layout
PASS  390 menu sheet navigates
PASS  reduced motion: drawer has no animation  [none]
PASS  no console errors

111/111 checks passed
```
