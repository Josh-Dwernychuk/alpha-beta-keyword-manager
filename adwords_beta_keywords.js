function getNegativeKeywordForCampaign(entry) {
  /* Method to allow for automatic management of alpha and beta keywords
  */
  var campaignIterator = AdWordsApp.campaigns()
      .withCondition("Name = "+'"'+entry+'"')
      .get();

  if (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var negativeKeywordIterator = campaign.negativeKeywords().get();
    word_in_list=0;
    while (negativeKeywordIterator.hasNext()) {
      var negativeKeyword = negativeKeywordIterator.next();
      for (i=0; i < all_negative_keywords.length; i++) {

        if (negativeKeyword.getText() == all_negative_keywords[i]) {
          word_in_list=1;
        }
      }
      if (word_in_list ==0 && negativeKeyword.getMatchType() == 'BROAD') {
        all_negative_keywords.push(negativeKeyword.getText());
        all_match_types.push(negativeKeyword.getMatchType());
      }else if (word_in_list ==0 && negativeKeyword.getMatchType() == 'PHRASE') {
        all_negative_keywords.push('"'+negativeKeyword.getText()+'"');
        all_match_types.push(negativeKeyword.getMatchType());
      }else if (word_in_list ==0 && negativeKeyword.getMatchType() == 'EXACT') {
        all_negative_keywords.push('['+negativeKeyword.getText()+']');
        all_match_types.push(negativeKeyword.getMatchType());
      }

    }
  }
}

function getAllCampaigns() {
  /* AdWordsApp.campaigns() will return all campaigns that are not removed by
    default
  */
  var campaignIterator = AdWordsApp.campaigns().get();
  //Logger.log('Total campaigns found : ' +
  //    campaignIterator.totalNumEntities());
  list_of_campaigns=[];

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    list_of_campaigns.push(campaign.getName());
  }
}

function findBetaCampaigns() {
  beta_campaigns=[];
  for (i=0; i < list_of_campaigns.length; i++) {
    var campaign = list_of_campaigns[i];
    if (campaign.search('Head') != -1 || campaign.search('Full') != -1) {
      beta_campaigns.push(campaign);
    }
  }
}

function getAllNegativeKeywords() {
  for (i=0; i < beta_campaigns.length; i++) {
    getNegativeKeywordForCampaign(beta_campaigns[i]);
  }
  Logger.log(all_negative_keywords);
  Logger.log(all_match_types);
}

function writeNegativesToShared() {
    var negativeKeywordListIterator =
      AdWordsApp.negativeKeywordLists().withCondition("Name = 'Beta Shared Negative List'").get();

    if (negativeKeywordListIterator.totalNumEntities() == 1) {
        var negativeKeywordList = negativeKeywordListIterator.next();
        var sharedNegativeKeywordIterator =
            negativeKeywordList.negativeKeywords().get();

    var sharedNegativeKeywords = [];

    while (sharedNegativeKeywordIterator.hasNext()) {
        sharedNegativeKeywords.push(sharedNegativeKeywordIterator.next());
        }
    }
    for (var i = 0; i < sharedNegativeKeywords.length; i++) {
      for (var j = 0; j < all_negative_keywords.length; j++) {
        if (sharedNegativeKeywords[i].getText() == all_negative_keywords[j]) {
          all_negative_keywords.splice(j,1);
          all_match_types.splice(j,1);
        }
      }
      }

    Logger.log(all_negative_keywords);
    Logger.log(all_match_types);

    negativeKeywordList.addNegativeKeywords(all_negative_keywords);

}


function main() {
  all_negative_keywords=[];
  all_match_types=[];
  getAllCampaigns()
  findBetaCampaigns()
  getAllNegativeKeywords()
  writeNegativesToShared()



}
