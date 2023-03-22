<?php 

namespace Models\ForeignSentences;

class ForeignSentencesModel extends BaseModel
{
    public function __construct($db)
    {
        $table = 'foreign_sentences';
        $columns = array('id' , ...);
        $primaryKeys = array('id');
        parent::__construct($db, $table, $columns, $primaryKeys);
    }
}
