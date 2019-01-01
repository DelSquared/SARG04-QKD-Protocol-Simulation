import random

#======ENCODER & DECODER======
def EncodePacket(bit,basis):
  qubit = [bit,basis] #qubit to be sent
  qubitC = [bit,0] #qubit in C-basis
  qubitH = [bit,1] #qubit in H-basis
  return [qubit,qubitC,qubitH] #in a realistic scenario, these could be sent as separate packets

def DecodePacket(packet,basis):
  qubit=packet[0]
  qubitC=packet[1]
  qubitH=packet[2] #parsing packet
  measureQubit=0 #recording measurement of qubit

  if basis==0:
    if qubit[1]==0:
      measureQubit=qubit
    if qubit[1]==1:
      measureQubit=random.choice([[1,0],[0,0]])
  if basis==1:
    if qubit[1]==1:
      measureQubit=qubit
    if qubit[1]==0:
      measureQubit=random.choice([[1,1],[0,1]]) #simulation of measuring qubit

  if basis==0:
    if measureQubit!=qubitC:
      return 1
    else:
      return -1
  if basis==1:
    if measureQubit!=qubitH:
      return 0
    else:
      return -1 #Trying to deduce the basis from the measurement and the bits Alice sent. Returning -1 means inconclusive.

#======STATISTICS======
success = 0
inconclusive = 0
totalTests = 1000000 #sending a stream of 1000000 test packets

#======TESTS======
for _ in range(totalTests): #starting packet stream

  #======ALICE======
  bit = random.choice([0,1])
  basis = random.choice([0,1]) #creating test qubit

  packet = EncodePacket(bit,basis) #packet sent to Bob

  #======BOB======
  basisPrediction = DecodePacket(packet,random.choice([0,1]))

  #======RESULT COMPARISON======
  if basisPrediction==basis:
    #print("Success: Basis match")
    success+=1
  else:
    #print("Error: Basis mismatch")
    inconclusive+=1

print("There were {} successful and {} inconclusive".format(success,inconclusive))
print("Success rate: {}%".format(success*100/totalTests))
