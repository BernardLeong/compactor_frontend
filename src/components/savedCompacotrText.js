return(
    <div className='grid-container'>
        <div className='dashboard-item-03 lol bordercolor'>
            <NavBarContent/>
        </div>
        <div className='dashboard-item-04 lol dangercolor'>
            <div>
            <span><img src={require('./alarmRaised.png')} width="100" height="90"></img></span>
<span className='cardAdjustment' >Alarm Raised : &nbsp;<span className='font-sizing'>{this.state.numberofAlarms}</span></span>
            <div>&nbsp;</div>
            <div className='lineBreak'></div>
            <div>&nbsp;</div>
            <div onClick={this.renderAlarmTable} className='cardAdjustment'>Details</div>
            </div>
        </div>
        <div className='dashboard-item-05 lol weightColor'>
            <div>
              <span><img src={require('./weight.png')} width="100" height="90"></img></span>
<span className='cardAdjustment' >Collection Weight : &nbsp;<span className='font-sizing'>{totalCollectedWeight}</span></span>
              <div>&nbsp;</div>
              <div className='lineBreak'></div>
              <div>&nbsp;</div>
              <div onClick={this.renderCollectionWeight} className='cardAdjustment'>Details</div>
            </div>
        </div>
        <div className='dashboard-item-06 compactorColor'>
        <div>
              <span><img src={require('./compactorImg.png')} width="100" height="90"></img></span>
<span className='cardAdjustment' >Compactor Information : &nbsp;<span className='font-sizing'>{this.state.compactorDataLength}</span></span>
              <div>&nbsp;</div>
              <div className='lineBreak'></div>
              <div>&nbsp;</div>
              <div onClick={this.renderCompactorInfo} className='cardAdjustment'>Details</div>
            </div>
        </div>
        <div className='dashboard-item-07 tableBg'>
          <DashboardTable 
          userType={this.props.location.state.userType} renderCompactorInfo={this.state.renderCompactorInfo} renderAlarmTable={this.state.renderAlarmTable} renderWeightTable={this.state.renderWeightTable} compactorLoaded={this.state.compactorLoaded} compactorData={this.state.compactorData} 
          alarmsLoaded={this.state.alarmsLoaded} alarmData={this.state.alarmData} token={this.props.location.state.token} />
        </div>
    </div>
)