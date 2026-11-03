const initialParty = [
  {
    floor: 2,
    rooms: [
      {
        id: "balcony",
        name: "Balcony",
        guests: [
          { name: "Aigerim", color: "green", time: "20:45", isAitu: true, things: ["cup", "cake_crumbs"] },
          { name: "Aliya", color: "black", time: "21:15", isAitu: false, things: ["phone", "cup"] },
          { name: "Madina", color: "green", time: "22:10", isAitu: false, things: ["phone", "bag", "cake_crumbs"] },
          { name: "Ivan", color: "black", time: "20:10", isAitu: true, things: ["cup"] }
        ]
      },
      {
        id: "hall",
        name: "Hall",
        guests: [
          { name: "Arman", color: "yellow", time: "20:35", isAitu: false, things: ["bag", "glasses"] },
          { name: "Sophia", color: "purple", time: "21:20", isAitu: true, things: ["phone"] },
          { name: "Dias", color: "green", time: "19:45", isAitu: true, things: [] },
          { name: "Bekzat", color: "purple", time: "20:55", isAitu: false, things: ["bag", "cup", "cake_crumbs"] },
          { name: "Aruzhan", color: "blue", time: "21:50", isAitu: true, things: ["phone"] },
          { name: "Saule", color: "green", time: "21:25", isAitu: false, things: ["glasses"] }
        ]
      }
    ]
  },
  {
    floor: 1,
    rooms: [
      {
        id: "kitchen",
        name: "Kitchen",
        guests: [
          { name: "Nurlan", color: "red", time: "19:40", isAitu: true, things: ["phone", "cup"] },
          { name: "Emma", color: "black", time: "20:15", isAitu: false, things: ["bag"] },
          { name: "Timur", color: "green", time: "21:05", isAitu: true, things: ["phone", "bag", "cake_crumbs"] },
          { name: "Sergey", color: "yellow", time: "20:50", isAitu: false, things: [] },
          { name: "Yerlan", color: "red", time: "21:40", isAitu: true, things: ["glasses", "phone"] },
          { name: "Kamila", color: "green", time: "20:05", isAitu: false, things: ["cup"] }
        ]
      },
      {
        id: "living-room",
        name: "Living room",
        guests: [
          { name: "Daniel", color: "blue", time: "19:55", isAitu: true, things: ["glasses"] },
          { name: "Zarina", color: "green", time: "21:10", isAitu: false, things: ["bag", "phone", "cake_crumbs"] },
          { name: "Natasha", color: "yellow", time: "20:30", isAitu: true, things: [] },
          { name: "Askar", color: "black", time: "21:00", isAitu: true, things: ["phone"] },
          { name: "Inkar", color: "purple", time: "20:20", isAitu: false, things: ["bag"] }
        ]
      }
    ]
  }
];

let partyData = JSON.parse(JSON.stringify(initialParty));

const thingIcons = {
  phone: "📱",
  glasses: "👓",
  bag: "👜",
  cup: "☕",
  cake_crumbs: "🍰"
};

function createGuestCard(guest, roomId, floorNum) {
  const thingClasses = guest.things.map(t => "has-" + t).join(" ");
  const aituClass = guest.isAitu ? "aitu" : "not-aitu";
  const colorClass = "color-" + guest.color;

  const $card = $("<div>")
    .addClass("guest " + colorClass + " " + aituClass + " " + thingClasses)
    .attr("data-name", guest.name)
    .attr("data-color", guest.color)
    .attr("data-time", guest.time)
    .attr("data-aitu", guest.isAitu)
    .attr("data-things", guest.things.join(" "))
    .attr("data-room", roomId)
    .attr("data-floor", floorNum);

  const $avatarWrap = $("<div>").addClass("avatar-wrap");
  const avatarUrl = "https://api.dicebear.com/9.x/open-peeps/svg?seed=" + guest.name;
  $("<img>").attr("src", avatarUrl).attr("alt", guest.name).appendTo($avatarWrap);

  if (guest.isAitu) {
    $("<span>").addClass("aitu-badge").text("🎓").appendTo($avatarWrap);
  }

  $card.append($avatarWrap);
  $("<div>").addClass("guest-name").text(guest.name).appendTo($card);
  $("<div>").addClass("guest-time").text("🕒 " + guest.time).appendTo($card);

  const $thingsWrap = $("<div>").addClass("guest-things");
  guest.things.forEach(t => {
    $("<span>")
      .addClass("thing-icon")
      .text(thingIcons[t] || t)
      .attr("title", t.replace("_", " "))
      .appendTo($thingsWrap);
  });
  $card.append($thingsWrap);

  return $card;
}

function buildParty(data) {
  const $house = $("#house-floors");
  $house.empty();

  data.forEach(floorObj => {
    const $floorRow = $("<div>").addClass("floor-row").attr("id", "floor-" + floorObj.floor);
    $("<div>").addClass("floor-tag").text("Floor " + floorObj.floor).appendTo($floorRow);

    const $roomsWrapper = $("<div>").addClass("rooms-wrapper");
    floorObj.rooms.forEach(roomObj => {
      const $room = $("<div>").addClass("room").attr("id", roomObj.id).attr("data-floor", floorObj.floor);

      const $header = $("<div>").addClass("room-header");
      $("<div>").addClass("room-title").text(roomObj.name).appendTo($header);
      $room.append($header);

      const $guestsList = $("<div>").addClass("guests-list");
      roomObj.guests.forEach(g => {
        const $card = createGuestCard(g, roomObj.id, floorObj.floor);
        $guestsList.append($card);
      });
      $room.append($guestsList);
      $roomsWrapper.append($room);
    });

    $floorRow.append($roomsWrapper);
    $house.append($floorRow);
  });
}

function makeJump($elements) {
  $elements.each(function() {
    const $el = $(this);
    $el.css({ position: "relative" })
      .animate({ top: "-18px" }, 180)
      .animate({ top: "0px" }, 180);
  });
}

function runCase(caseNum) {
  buildParty(partyData);
  $(".guest").removeClass("found-highlight");
  $(".room").removeClass("room-highlighted");

  let $found;
  let description = "";

  switch (caseNum) {
    case 1:
      description = "Who is in the hall?";
      $found = $("#hall .guest");
      break;
    case 2:
      description = "Who is dressed in yellow or purple?";
      $found = $(".guest.color-yellow, .guest.color-purple");
      break;
    case 3:
      description = "Which AITU students are upstairs?";
      $found = $("#floor-2 .guest.aitu");
      break;
    case 4:
      description = "Who has glasses or a bag?";
      $found = $(".guest.has-glasses, .guest.has-bag");
      break;
    case 5:
      description = "Who came with nothing at all?";
      $found = $(".guest:not(.has-phone, .has-glasses, .has-bag, .has-cup, .has-cake_crumbs)");
      break;
    case 6:
      description = "Who has a phone but no bag?";
      $found = $(".guest.has-phone:not(.has-bag)");
      break;
    case 7:
      description = "Who arrived between 20:30 and 21:00, both times included?";
      $found = $(".guest").filter(function() {
        const t = $(this).attr("data-time");
        return t >= "20:30" && t <= "21:00";
      });
      break;
    case 8:
      description = "Who arrived after 21:00 and is not an AITU student?";
      $found = $(".guest:not(.aitu)").filter(function() {
        return $(this).attr("data-time") > "21:00";
      });
      break;
    case 9:
      description = "Who stands right next to Askar?";
      $found = $('.guest[data-name="Askar"]').prev(".guest").add($('.guest[data-name="Askar"]').next(".guest"));
      break;
    case 10:
      description = "Who stands last in each room?";
      $found = $(".room .guests-list > .guest:last-child");
      break;
    case 11:
      description = "Who stands third in each room?";
      $found = $(".room .guests-list > .guest:nth-child(3)");
      break;
    case 12:
      description = "Who stands after Timur in his room?";
      $found = $('#kitchen .guest[data-name="Timur"]').nextAll(".guest");
      break;
    case 13:
      description = "Who stands right before someone in black?";
      $found = $(".guest.color-black").prev(".guest");
      break;
    case 14:
      description = "In which room is Aruzhan?";
      $found = $('.guest[data-name="Aruzhan"]').closest(".room");
      break;
    case 15:
      description = "Which rooms have fewer than 6 guests?";
      $found = $(".room").filter(function() {
        return $(this).find(".guest").length < 6;
      });
      break;
    case 16:
      description = "In which rooms does somebody have a cup, but nobody wears glasses?";
      $found = $(".room:has(.guest.has-cup):not(:has(.guest.has-glasses))");
      break;
    case 17:
      description = "Who came first to each room?";
      $found = $(".guest").filter(function() {
        const myTime = $(this).attr("data-time");
        return $(this).siblings(".guest").filter(function() {
          return $(this).attr("data-time") < myTime;
        }).length === 0;
      });
      break;
    case 18:
      description = "Miras joins between Askar and Inkar with fadeIn().";
      const miras = createGuestCard(
        { name: "Miras", color: "blue", time: "21:20", isAitu: true, things: ["phone"] },
        "living-room",
        1
      );
      miras.hide().insertAfter($('.guest[data-name="Askar"]')).fadeIn(600);
      $found = miras;
      break;
    case 19:
      description = "Natasha says goodbye and her card fades away.";
      $found = $('.guest[data-name="Natasha"]');
      $found.fadeOut(600, function() {
        $(this).remove();
      });
      break;
    case 20:
      description = "Who took the cake? (The Thief)";
      $found = $("#floor-1 .guest:not(.has-cup).has-cake_crumbs").filter(function() {
        const t = $(this).attr("data-time");
        return t > "21:00" && t < "21:30";
      }).filter(function() {
        return $(this).prev(".aitu").length > 0 || $(this).next(".aitu").length > 0;
      });
      break;
  }

  $(".btn-case").removeClass("active");
  $('.btn-case[data-case="' + caseNum + '"]').addClass("active");

  if ($found.hasClass("room")) {
    $found.addClass("room-highlighted");
    const roomNames = $found.map(function() {
      return $(this).find(".room-title").text();
    }).get().join(", ");
    $("#result-text").html("<strong>Case " + caseNum + ":</strong> " + description + " &rarr; Found <strong>" + $found.length + " room(s):</strong> " + roomNames);
    makeJump($found);
  } else {
    $found.addClass("found-highlight");
    const names = $found.map(function() {
      return $(this).attr("data-name");
    }).get().join(", ");
    $("#result-text").html("<strong>Case " + caseNum + ":</strong> " + description + " &rarr; Found <strong>" + $found.length + " guest(s):</strong> " + names);
    makeJump($found);
  }
}

$(document).ready(function() {
  buildParty(partyData);

  $(".btn-case").on("click", function() {
    const caseNum = parseInt($(this).attr("data-case"), 10);
    runCase(caseNum);
  });

  $("#btn-reset-party").on("click", function() {
    partyData = JSON.parse(JSON.stringify(initialParty));
    buildParty(partyData);
    $(".btn-case").removeClass("active");
    $("#result-text").html("Party reset to initial picture. Select any case to inspect.");
  });
});
