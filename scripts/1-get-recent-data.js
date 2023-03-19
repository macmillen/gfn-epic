// https://www.pcgamer.com/epic-games-store-free-games-list/

let data = Array.from(
  document.querySelector("#article-body").querySelectorAll("ul")
).flatMap((ul) => {
  const lis = ul.querySelectorAll("li");
  return Array.from(lis).reduce((acc, li) => {
    const { textContent } = li;
    let [dateStr, ..._title] = textContent?.split(/:\s/);
    let title = _title.join(": ");

    // DATE CORRECTIONS
    if (title === "Among the Sleep") {
      dateStr = "Oct 21 - Oct 28, 2021";
    }
    if (title === "Jurassic World Evolution") {
      dateStr = "Dec 31, 2020 - Jan 7, 2021";
    }
    if (title === "Torment x Punisher") {
      dateStr = "Mar 26 - Apr 2, 2020";
    }

    let titles = [];

    if (title === "City of Gangsters, Dishonored: Death of the Outsider") {
      titles.push("City of Gangsters", "Dishonored: Death of the Outsider");
    } else if (title === "Adios, Hell is Others") {
      titles.push("Adios", "Hell is Others");
    } else if (title === "First Class Trouble, Gamedec - Definitive Edition") {
      titles.push("First Class Trouble", "Gamedec - Definitive Edition");
    } else if (
      title === "Kerbal Space Program, Shadow Tactics - Aiko's Choice"
    ) {
      titles.push("Kerbal Space Program", "Shadow Tactics - Aiko's Choice");
    } else if (title === "Fallout, Fallout 2, and Fallout Tactics") {
      titles.push("Fallout", "Fallout 2", "Fallout Tactics");
    } else if (title === "Saints Row IV Re-Elected, Wildcat Gun Machine") {
      titles.push("Saints Row IV Re-Elected", "Wildcat Gun Machine");
    } else if (title === "Fort Triumph, RPG in a Box") {
      titles.push("Fort Triumph", "RPG in a Box");
    } else if (title === "Alba, Shadow Tactics: Blades of the Shogun") {
      titles.push("Alba", "Shadow Tactics: Blades of the Shogun");
    } else if (title === "Filament, Rising Storm 2: Vietnam") {
      titles.push("Filament", "Rising Storm 2: Vietnam");
    } else if (title === "Saturnalia, Warhammer 40,000: Mechanicus") {
      titles.push("Saturnalia", "Warhammer 40,000: Mechanicus");
    } else if (title === "Evoland Legendary Edition, Fallout 3") {
      titles.push("Evoland Legendary Edition", "Fallout 3");
    } else if (title === "Darkwood, ToeJam & Earl: Back in the Groove!") {
      titles.push("Darkwood", "ToeJam & Earl: Back in the Groove!");
    } else if (title === "Rising Hell, Slain: Back From Hell") {
      titles.push("Rising Hell", "Slain: Back From Hell");
    } else if (title === "Runbow, The Drone Racing League Simulator") {
      titles.push("Runbow", "The Drone Racing League Simulator");
    } else if (title === "ARK: Survival Evolved, Gloomhaven") {
      titles.push("ARK: Survival Evolved", "Gloomhaven");
    } else if (title === "Spirit of the North, The Captain") {
      titles.push("Spirit of the North", "The Captain");
    } else if (
      title ===
      "Hundred Days - Winemaking Simulator, Realm Royale Reforged Epic Launch Bundle"
    ) {
      titles.push(
        "Hundred Days - Winemaking Simulator",
        "Realm Royale Reforged Epic Launch Bundle"
      );
    } else if (
      title === "Shadow of the Tomb Raider, Submerged: Hidden Depths"
    ) {
      titles.push("Shadow of the Tomb Raider", "Submerged: Hidden Depths");
    } else if (title === "Doom 64, Rumbleverse Boom Boxer pack") {
      titles.push("Doom 64", "Rumbleverse Boom Boxer pack");
    } else if (title === "Shop Titans, Tannenberg") {
      titles.push("Shop Titans", "Tannenberg");
    } else if (
      title ===
      `Idle Champions of the Forgotten Realms, Wonder Boy: The Dragon's Trap
July 7 - July 14, 2022:  Ancient Enemy, Killing Floor 2`
    ) {
      // TODO
      titles.push(
        "Idle Champions of the Forgotten Realms",
        "Wonder Boy: The Dragon's Trap"
      );
    } else if (
      title ===
      "Geneforge 1: Mutagen, Hood: Outlaws & Legends, Iratus: Lord of the Dead"
    ) {
      titles.push(
        "Geneforge 1: Mutagen",
        "Hood: Outlaws & Legends",
        "Iratus: Lord of the Dead"
      );
    } else if (
      title ===
      "Car Mechanic Simulator 2018, A Game Of Thrones: The Board Game Digital Edition"
    ) {
      titles.push(
        "Car Mechanic Simulator 2018",
        "A Game Of Thrones: The Board Game Digital Edition"
      );
    } else if (
      title === "Prey, Jotun: Valhalla Edition, Redout: Enhanced Edition"
    ) {
      titles.push(
        "Prey",
        "Jotun: Valhalla Edition",
        "Redout: Enhanced Edition"
      );
    } else if (title === "Paradigm, Just Die Already") {
      titles.push("Paradigm", "Just Die Already");
    } else if (title === "Amnesia Rebirth, Riverbond") {
      titles.push("Amnesia Rebirth", "Riverbond");
    } else if (title === "XCOM 2, Insurmountable") {
      titles.push("XCOM 2", "Insurmountable");
    } else if (title === "Rogue Legacy, The Vanishing of Ethan Carter") {
      titles.push("Rogue Legacy", "The Vanishing of Ethan Carter");
    } else if (title === "Total War: Warhammer, City of Brass") {
      titles.push("Total War: Warhammer", "City of Brass");
    }

    if (title.includes(",")) {
      console.log(title);
    }

    let date;

    const hasRange = dateStr.match(/\s-\s/);

    if (hasRange) {
      const [date1, date2] = dateStr.split(/\s-\s/);
      const [day1, year1] = date1.split(/,\s/);
      const [day2, year2] = date2.split(/,\s/);
      date = {
        from: new Date(`${day1}, ${year1 ?? year2}`),
        until: new Date(`${day2}, ${year2}`),
      };
    } else {
      date = {
        from: new Date(dateStr).toISOString(),
        until: new Date(dateStr).toISOString(),
      };
    }

    if (titles.length) {
      return [...acc, ...titles.map((title) => ({ title, date, dateStr }))];
    }

    return [...acc, { title, date, dateStr }];
  }, []);
});

// check for errors
data.forEach((data) => {
  const {
    date: { from, until },
    title,
    dateStr,
  } = data;
  if (
    from.toString() === "Invalid Date" ||
    until.toString() === "Invalid Date"
  ) {
    console.error(title);
    if (from.toString() === "Invalid Date") {
      console.error("Invalid From Date");
    }
    if (until.toString() === "Invalid Date") {
      console.error("Invalid Until Date");
    }
    console.error(dateStr);
  }
});

console.log(data);
