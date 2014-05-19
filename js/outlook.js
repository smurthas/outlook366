/*Mousetrap.stopCallback = function(e, element, combo) {

    // if the element has the class "mousetrap" then no need to stop
    if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
        return false;
    }
    console.error('e', e);

    if (e.metaKey && e.keyCode === 75) return false;
    console.error('e2', e);


    // stop for input, select, and textarea
    return element.tagName == 'INPUT'
        || element.tagName == 'SELECT'
        || element.tagName == 'TEXTAREA'
        || (element.contentEditable && element.contentEditable == 'true');
}*/
function buildRow(shortcut, description) {
  var spl = shortcut.split(' ');
  var str = '<tr>' + '<td><span class="yellow">' + spl[0] + '</span>';
  if (spl[1]) str += ' then <span class="yellow">' + spl[1] + '</span>';
  str += ':</td><td>' + description + '</td></tr>';
  return str;
}


function showHelp() {
  console.log('show help');
  if ($("#o365-ks").length > 0) {
    if ($("#o365-ks").is(":visible")) return $("#o365-ks").hide();
    else return $("#o365-ks").show();
  }
  console.log('building help!');
  var html = '<div id="o365-ks"><div id="title">Keyboard Shortcuts!</div>';
  html += '<table id="outer-table"><tr>';

  var columns = ['<td class="o365-ks-col">', '<td class="o365-ks-col">'];

  var col = 1;
  for (var sectionTitle in mappings) {
    col = (col+1) % 2;
    var section = mappings[sectionTitle];
    columns[col] += '<table><tr><th></th><th>' + sectionTitle + '</th></tr>';
    for (var shortcut in section) {
      columns[col] += buildRow(shortcut, section[shortcut].description);
    }
    columns[col] += '</table>';
  }
  columns[0] += '</td>';
  columns[1] += '</td>';
  html += columns.join('');
  html += '</tr></table></div>';
  console.error('html', html);
  $('body').append(html);
}

var mappings = {
  'Navigation': {
    '/': {
      description: 'Move focus to search bar',
      handler: function() {
        $('button[aria-label="Activate Search Textbox"]').click();
        $('input[aria-label*="Start Searching"]').focus();
        return false;
      }
    },
    'j': {
      description: 'Next row',
      handler: function() {
        console.error('j');
        var press = jQuery.Event('keypress');
        press.ctrlKey = false;
        press.which = 38;
        setTimeout(function() {
          $(document).trigger(press);
        }, 100);
        return false;
      }
    },
    /*'k': {
      description: 'Previous row',
      handler: changeRows.bind(null, -1)
    },*/
    '?': {
      description: 'Show/Hide help',
      handler: showHelp
    },
    'c': {
      description: 'Compose new mail',
      handler:function() {
        $('span:contains("new mail")').click();
        return false;
      }
    },
    'r': {
      description: 'Reply',
      handler:function() {
        $('span:contains("REPLY"):not(:contains("REPLY ALL"))').first().click();
        return false;
      }
    },
    'a': {
      description: 'Reply All',
      handler:function() {
        $('span:contains("REPLY ALL")').first().click();
        return false;
      }
    },
    'f': {
      description: 'Forward',
      handler:function() {
        $('span:contains("FORWARD")').first().click();
        return false;
      }
    },
    'y': {
      description: 'Archive current message',
      handler:function() {
        $('div[aria-label="Mail list"]').find('div[aria-selected=true]').find('button[title=Delete]').click();
        //$('div[aria-labelledby="null.mail_list_view_info_message"]').find('button[aria-checked="true"]').next().find('button[title="Delete"]').click()
        return false;
      }
    },
    'g i': {
      description: 'Go to inbox',
      handler:function() {
        $('span[title="Inbox"]:contains("Inbox")').click();
        return false;
      }
    },
    'g t': {
      description: 'Go to sent mail',
      handler:function() {
        $('span[title="Sent Items"]:contains("Sent Items")').click();
        return false;
      }
    },
    'g d': {
      description: 'Go to drafts',
      handler:function() {
        $('span[title="Drafts"]:contains("Drafts")').click();
        return false;
      }
    },
    'command+k': {
      description: 'Add hyperlink',
      handler:function() {
        console.log(document.getSelection());
        $("#divcreatelink").click();
        return false;
      },
      global: true
    }
  }/*,
  'Jumping': {
    'g l': {
      description: 'Go to My Leads',
      handler: gotoTab.bind(null, 'Lead')
    },
    'g a': {
      description: 'Go to My Accounts',
      handler: gotoTab.bind(null, 'Account')
    },
    'g o': {
      description: 'Go to My Opportunites',
      handler: gotoTab.bind(null, 'Opportunity')
    },
    'g r': {
      description: 'Go to My Reports',
      handler: gotoTab.bind(null, 'Report')
    },
    'g c': {
      description: 'Go to My Contacts',
      handler: gotoTab.bind(null, 'Contact')
    }
  }*/
};

for (var section in mappings) {
  for(var k in mappings[section]) {
    var bind = mappings[section][k];
    Mousetrap[bind.global? 'bindGlobal' : 'bind'](k, bind.handler);
  }
}
