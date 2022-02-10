// Main
let player = { name: "player", hand: [], handVal: 0 };
let dealer = { name: "dealer", hand: [], handVal: 0 };
document.getElementById("new-game").addEventListener("click", setDeckId);
document.getElementById("draw-card").addEventListener("click", function(){drawCard(player)});
document.getElementById("stand").addEventListener("click", stand);
let deckId;

async function getDeckId()
{
  let url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
  const response = await fetch(url);
  const json =  await response.json();
  const id = await json.deck_id;
  return id;
}
async function setDeckId()
{
  document.getElementById("player-hand").innerHTML = "";
  document.getElementById("dealer-hand").innerHTML = "";
  document.getElementById("message").innerHTML = "";
  document.getElementById("message").style.backgroundColor = "";
  document.getElementById("message").style.padding = "";
  player.hand = [];
  dealer.hand = [];
  player.handVal = 0;
  dealer.handVal = 0;
  deckId = await getDeckId();
  drawCard(dealer);
}

async function drawCard(player)
{
  if (deckId == undefined)
  {
    return;
  }
  let url = "http://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=2";
  const response = await fetch(url);
  const json =  await response.json();
  const img = await json.cards[0].image;
  const value = await json.cards[0].value
  player.hand.push(await value);
  if (value == "ACE")
  {
    player.handVal += 11;
  }
  else if (value == "KING" || value == "QUEEN" || value == "JACK")
  {
    player.handVal += 10;
  }
  else
  {
    player.handVal += parseInt(value);
  }

  if (player.handVal > 21 && player.hand.includes("ACE"))
  {
    player.handVal -= 10;
    let i = player.hand.indexOf("ACE");
    player.hand.splice(i);
  }
  console.log(player.handVal);
  console.log(player.hand);

  let elementId = player.name + "-hand";
  document.getElementById(elementId).innerHTML += "<img src=" + img + ">";
  if (player.handVal > 21 && player.name == "player")
  {
    document.getElementById("message").innerHTML = "<h2>You Lose!</h2>";
    document.getElementById("message").style.backgroundColor = "rgb(143, 143, 143, 0.75)";
    document.getElementById("message").style.padding = "10px";
    deckId = undefined;
  }
  else if (player.handVal == 21 && player.name == "player")
  {
    stand();
  }
}

async function stand()
{
  if (player.handVal == 0 || player.handVal > 21)
  {
    return;
  }
  while (dealer.handVal < 21 && dealer.handVal <= player.handVal)
  {
    await drawCard(dealer);
  }
  if (dealer.handVal > 21)
  {
    document.getElementById("message").innerHTML = "<h2>You Win!</h2>";
    document.getElementById("message").style.backgroundColor = "rgb(143, 143, 143, 0.75)";
    document.getElementById("message").style.padding = "10px";
    deckId = undefined;
  }
  else if (dealer.handVal > player.handVal)
  {
    document.getElementById("message").innerHTML = "<h2>You Lose!</h2>";
    document.getElementById("message").style.backgroundColor = "rgb(143, 143, 143, 0.75)";
    document.getElementById("message").style.padding = "10px";
    deckId = undefined;
  }
  else if (dealer.handVal == player.handVal)
  {
    document.getElementById("message").innerHTML = "<h2>It's a Tie.</h2>";
    document.getElementById("message").style.backgroundColor = "rgb(143, 143, 143, 0.75)";
    document.getElementById("message").style.padding = "10px";
    deckId = undefined;
  }
  else
  {
    document.getElementById("message").innerHTML = "<h2>Error</h2>";
    document.getElementById("message").style.backgroundColor = "rgb(143, 143, 143, 0.75)";
    document.getElementById("message").style.padding = "10px";
    deckId = undefined;
  }
}
