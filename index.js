$ (function() { //$( document ).ready(function() {}); is already deprecated
  $('#search-btn').on("click", () => {

    const username = $('#search-input').val();
    const githubUrl = `https://api.github.com/users/${username}`;

    $.ajax ({
      url: githubUrl,
      type: 'GET',  
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      dataType: "json",
      success: data => {
        if ($("#err-msg").css("display") === "inline-block") {
          $("#err-msg").css("display", "none");
        } else {
          // console.log(data);

          // Profile name summary ------------------------------
          const profilePic = $("#profile-pic"),
                profileName = $("#profile-name"),
                profileUsername = $("#profile-username"),
                joinDate = $("#join-date");

          profilePic.attr("src", data.avatar_url);
          if (data.name === "" || data.name === null) {
            profileName.text(data.login);
          } else {
            profileName.text(data.name);
          }
          profileUsername.text(`@${data.login}`);
          
          const isoDate = data.created_at;
          const dateObj = new Date(isoDate);
          const dateFormatted = dateObj.toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}).replace(',', '');
          joinDate.text(`Joined ${dateFormatted}`);

          // Bio Description -----------------------------------
          const bioDescription = $("#bio-description");

          if (data.bio === "" || data.bio === null) {
            bioDescription.text("This profile has no bio");
            bioDescription.css("opacity", "60%");
          } else {
            bioDescription.text(data.bio);
          };

          // Bio Stats -----------------------------------------
          const repos = $("#repos"),
                followers = $("#followers"),
                following = $("#following");

          repos.text(data.public_repos);
          followers.text(data.followers);
          following.text(data.following);

          // Other Details -------------------------------------
          const otherDetails = $("#other-details-container");

          function handleDetail(detail, content, value, href) {
            if (!value) {
              content.text("Not Available");
              detail.addClass('disable-link');
            } else {
              content.text(value);
              if (href) {
                content.attr('href', href);
              }
              detail.removeClass('disable-link');
            }
          }
          
          const detailHandlers = {
            location: (detail, content) => handleDetail(detail, content, data.location),
            website: (detail, content) => handleDetail(detail, content, data.blog, data.blog),
            twitter: (detail, content) => handleDetail(detail, content, data.twitter_username, `https://twitter.com/${data.twitter_username}`),
            company: (detail, content) => handleDetail(detail, content, data.company, `https://github.com/${data.login}`)
          };
          
          otherDetails.find('div').each(function() {
            const detail = $(this);
            const content = detail.find('p, a');
            const handler = detailHandlers[content.attr('id')];
            if (handler) {
              handler(detail, content);
            }
          });
        }
      },
      error: (error) => {
        if (error.responseJSON.message === "Not Found") {
          $("#err-msg").css("display", "inline-block");
        } else {
          console.log(error);
        }
      }
    });
  });
});


// For prefers-color-scheme
$(window).on('load', function() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      $('body').toggleClass('dark-theme');
  }
});


// For toggling between light and dark mode
$(function() {
  $("#toggle").click(() => {
    $("body").toggleClass("dark-theme");
    if ($("#mode").text() === "Dark") {
      $("#mode").html('Light<img id="icon-mode" src="./public/assets/icon-sun.svg" alt="icon-mode">');
    } else {
      $("#mode").text("Dark");
      $("#mode").html('Dark<img id="icon-mode" src="./public/assets/icon-moon.svg" alt="icon-mode">');
    }
  });
});



