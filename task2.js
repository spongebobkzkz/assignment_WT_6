let partyData = [
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

const initialPartySnapshot = JSON.parse(JSON.stringify(partyData));

const thingIcons = {
  phone: "📱",
  glasses: "👓",
  bag: "👜",
  cup: "☕",
  cake_crumbs: "🍰"
};

const roomSortStates = {
  "balcony": false,
  "hall": false,
  "kitchen": false,
  "living-room": false
};

let activeModalGuest = null;
let isMoving = false;

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
      $("<button>")
        .addClass("btn-sort")
        .attr("type", "button")
        .attr("data-room", roomObj.id)
        .text("Sort by time")
        .appendTo($header);

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

function clearSpotlight() {
  $(".guest").stop(true, false).fadeTo(300, 1.0).removeClass("found-highlight");
  $(".room").removeClass("room-highlighted");
  $(".btn-case").removeClass("active");
  $("#result-text").html("All guests brightened. Spotlight cleared.");
}

function applySpotlight($found, caseNum, description) {
  $(".btn-case").removeClass("active");
  $('.btn-case[data-case="' + caseNum + '"]').addClass("active");
  $(".room").removeClass("room-highlighted");
  $(".guest").removeClass("found-highlight");

  if ($found.hasClass("room")) {
    $found.addClass("room-highlighted");
    $found.find(".guest").stop(true, false).fadeTo(300, 1.0);
    $(".room").not($found).find(".guest").stop(true, false).fadeTo(300, 0.2);

    const names = $found.map(function() {
      return $(this).find(".room-title").text();
    }).get().join(", ");
    $("#result-text").html("<strong>Case " + caseNum + ":</strong> " + description + " &rarr; <strong>" + $found.length + " room(s):</strong> " + names);
  } else {
    $found.addClass("found-highlight");
    $found.stop(true, false).fadeTo(300, 1.0);
    $(".guest").not($found).stop(true, false).fadeTo(300, 0.2);

    const names = $found.map(function() {
      return $(this).attr("data-name");
    }).get().join(", ");
    $("#result-text").html("<strong>Case " + caseNum + ":</strong> " + description + " &rarr; <strong>" + $found.length + " guest(s):</strong> " + names);
  }
}

function runCase(caseNum) {
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
      description = "Miras joins between Askar and Inkar.";
      let $ask = $('.guest[data-name="Askar"]');
      if ($ask.length && !$('.guest[data-name="Miras"]').length) {
        const miras = createGuestCard(
          { name: "Miras", color: "blue", time: "21:20", isAitu: true, things: ["phone"] },
          "living-room",
          1
        );
        miras.hide().insertAfter($ask).fadeIn(600);
        $found = miras;
      } else {
        $found = $('.guest[data-name="Miras"]');
      }
      break;
    case 19:
      description = "Natasha says goodbye and goes home.";
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

  applySpotlight($found, caseNum, description);
}

function openGuestModal($guest) {
  if (!$guest || !$guest.length) return;

  if (activeModalGuest && activeModalGuest.attr("data-name") === $guest.attr("data-name")) {
    return;
  }

  if (activeModalGuest) {
    closeGuestModal(function() {
      openGuestModal($guest);
    });
    return;
  }

  activeModalGuest = $guest;

  const name = $guest.attr("data-name");
  const color = $guest.attr("data-color");
  const time = $guest.attr("data-time");
  const isAitu = $guest.attr("data-aitu") === "true";
  const thingsStr = $guest.attr("data-things") || "";
  const currentRoomId = $guest.closest(".room").attr("id");

  const thingsArr = thingsStr.split(" ").filter(Boolean);
  let thingsText = "Has nothing at all";
  if (thingsArr.length > 0) {
    const formatted = thingsArr.map(t => {
      if (t === "cake_crumbs") return "cake crumbs";
      return t;
    });
    if (formatted.length === 1) {
      thingsText = "Has a " + formatted[0];
    } else {
      thingsText = "Has " + formatted.slice(0, -1).join(", ") + " and " + formatted[formatted.length - 1];
    }
  }

  $("#modal-guest-name").text(name);
  $("#modal-guest-time").text("Came at " + time);
  $("#modal-guest-status").text(isAitu ? "AITU student 🎓" : "Guest (Not an AITU student)");
  $("#modal-guest-color").text("Wearing " + color + " clothing");
  $("#modal-guest-things").text(thingsText);
  $("#modal-guest-avatar").attr("src", "https://api.dicebear.com/9.x/open-peeps/svg?seed=" + name);

  const $moveButtons = $("#modal-move-buttons");
  $moveButtons.empty();

  const allRooms = [
    { id: "balcony", name: "Balcony" },
    { id: "hall", name: "Hall" },
    { id: "kitchen", name: "Kitchen" },
    { id: "living-room", name: "Living room" }
  ];

  allRooms.forEach(r => {
    if (r.id !== currentRoomId) {
      $("<button>")
        .addClass("btn-move-room")
        .attr("type", "button")
        .attr("data-target-room", r.id)
        .text("Move to " + r.name)
        .appendTo($moveButtons);
    }
  });

  const $avatar = $guest.find(".avatar-wrap");
  const startOffset = $avatar.offset();
  const startWidth = $avatar.outerWidth();
  const startHeight = $avatar.outerHeight();

  const targetWidth = Math.min($(window).width() * 0.88, 360);
  const targetLeft = ($(window).width() - targetWidth) / 2;
  const targetTop = Math.max($(window).scrollTop() + 100, ($(window).height() - 320) / 2);

  const $modal = $("#guest-zoom-modal");
  const $overlay = $("#modal-overlay");

  $overlay.stop(true, false).fadeIn(250);

  $modal.stop(true, false).css({
    display: "block",
    top: startOffset.top,
    left: startOffset.left,
    width: startWidth,
    height: startHeight,
    opacity: 0.2
  }).animate({
    top: targetTop,
    left: targetLeft,
    width: targetWidth,
    height: 340,
    opacity: 1
  }, 350);
}

function closeGuestModal(callback) {
  const $modal = $("#guest-zoom-modal");
  const $overlay = $("#modal-overlay");

  if (!activeModalGuest || !$modal.is(":visible")) {
    if (callback) callback();
    return;
  }

  const $avatar = activeModalGuest.find(".avatar-wrap");
  let endOffset = { top: $(window).height() / 2, left: $(window).width() / 2 };
  if ($avatar.length && $avatar.is(":visible")) {
    endOffset = $avatar.offset();
  }

  $overlay.stop(true, false).fadeOut(250);

  $modal.stop(true, false).animate({
    top: endOffset.top,
    left: endOffset.left,
    width: 20,
    height: 20,
    opacity: 0
  }, 280, function() {
    $modal.hide();
    activeModalGuest = null;
    if (callback) callback();
  });
}

function moveGuestToRoom(guestName, targetRoomId) {
  if (isMoving) return;
  isMoving = true;

  const $guest = $('.guest[data-name="' + guestName + '"]');
  const $targetRoom = $("#" + targetRoomId);
  const $targetList = $targetRoom.find(".guests-list");

  if (!$guest.length || !$targetList.length) {
    isMoving = false;
    return;
  }

  closeGuestModal(function() {
    let movedGuestData = null;
    partyData.forEach(floor => {
      floor.rooms.forEach(room => {
        const idx = room.guests.findIndex(g => g.name === guestName);
        if (idx !== -1) {
          movedGuestData = room.guests.splice(idx, 1)[0];
        }
      });
    });

    if (movedGuestData) {
      partyData.forEach(floor => {
        floor.rooms.forEach(room => {
          if (room.id === targetRoomId) {
            room.guests.push(movedGuestData);
          }
        });
      });
    }

    const startPos = $guest.offset();
    const $clone = $guest.clone().css({
      position: "absolute",
      top: startPos.top,
      left: startPos.left,
      width: $guest.outerWidth(),
      zIndex: 1500,
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
    }).appendTo("body");

    $guest.stop(true, false).animate({
      width: 0,
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 0,
      marginRight: 0,
      opacity: 0
    }, 450, function() {
      $guest.remove();
    });

    const floorNum = $targetRoom.attr("data-floor");
    const $newGuest = createGuestCard(movedGuestData, targetRoomId, floorNum);
    $newGuest.css({
      width: 0,
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 0,
      marginRight: 0,
      opacity: 0
    }).appendTo($targetList);

    $newGuest.stop(true, false).animate({
      width: 92,
      paddingLeft: "0.55rem",
      paddingRight: "0.55rem",
      opacity: 0.05
    }, 450);

    setTimeout(function() {
      const destPos = $newGuest.offset();
      $clone.stop(true, false).animate({
        top: destPos.top,
        left: destPos.left
      }, 550, function() {
        $clone.remove();
        $newGuest.css({ opacity: 1 });
        isMoving = false;
        $("#result-text").html("Moved <strong>" + guestName + "</strong> to " + $targetRoom.find(".room-title").text() + ".");
      });
    }, 50);
  });
}

function sortRoomByTime(roomId) {
  const $room = $("#" + roomId);
  const $list = $room.find(".guests-list");
  const $cards = $list.children(".guest");
  if ($cards.length <= 1) return;

  const isSorted = roomSortStates[roomId] || false;

  let sortedCards;
  if (!isSorted) {
    sortedCards = $cards.toArray().sort(function(a, b) {
      return $(a).attr("data-time").localeCompare($(b).attr("data-time"));
    });
    roomSortStates[roomId] = true;
    $room.find(".btn-sort").text("Reset order");
  } else {
    let originalNames = [];
    initialPartySnapshot.forEach(floor => {
      floor.rooms.forEach(r => {
        if (r.id === roomId) {
          originalNames = r.guests.map(g => g.name);
        }
      });
    });

    sortedCards = $cards.toArray().sort(function(a, b) {
      const nameA = $(a).attr("data-name");
      const nameB = $(b).attr("data-name");
      const idxA = originalNames.indexOf(nameA);
      const idxB = originalNames.indexOf(nameB);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });
    roomSortStates[roomId] = false;
    $room.find(".btn-sort").text("Sort by time");
  }

  const oldPositions = [];
  $cards.each(function() {
    oldPositions.push($(this).offset());
  });

  $list.append(sortedCards);

  const newPositions = [];
  $cards.each(function() {
    newPositions.push($(this).offset());
  });

  $cards.each(function(i) {
    const $card = $(this);
    const oldP = oldPositions[i];
    const newP = newPositions[i];
    const deltaX = oldP.left - newP.left;
    const deltaY = oldP.top - newP.top;

    $card.stop(true, false).css({
      position: "relative",
      left: deltaX,
      top: deltaY
    }).animate({
      left: 0,
      top: 0
    }, 450);
  });
}

$(document).ready(function() {
  buildParty(partyData);

  $(".btn-case").on("click", function() {
    const caseNum = parseInt($(this).attr("data-case"), 10);
    runCase(caseNum);
  });

  $("#btn-clear-spotlight").on("click", function() {
    clearSpotlight();
  });

  $(document).on("click", ".guest", function(e) {
    e.stopPropagation();
    openGuestModal($(this));
  });

  $("#modal-overlay, #btn-close-zoom").on("click", function() {
    closeGuestModal();
  });

  $(document).on("keydown", function(e) {
    if (e.key === "Escape") {
      closeGuestModal();
    }
  });

  $(document).on("click", ".btn-move-room", function(e) {
    e.stopPropagation();
    const targetRoomId = $(this).attr("data-target-room");
    if (activeModalGuest) {
      const guestName = activeModalGuest.attr("data-name");
      moveGuestToRoom(guestName, targetRoomId);
    }
  });

  $(document).on("click", ".btn-sort", function(e) {
    e.stopPropagation();
    const roomId = $(this).attr("data-room");
    sortRoomByTime(roomId);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const autoCase = urlParams.get("case");
  const autoGuest = urlParams.get("guest");
  const autoSort = urlParams.get("sort");

  if (autoCase) {
    runCase(parseInt(autoCase, 10));
  } else if (autoGuest) {
    setTimeout(function() {
      const $target = $('.guest[data-name="' + autoGuest + '"]');
      if ($target.length) {
        openGuestModal($target);
      }
    }, 150);
  } else if (autoSort) {
    setTimeout(function() {
      sortRoomByTime(autoSort);
    }, 150);
  }
});
